require('dotenv').config();
require('colors');
const express = require('express');
const ExpressWs = require('express-ws');
const path = require('path');

const { MongoClient } = require('mongodb');

const { GptService } = require('./services/gpt-service');
const { StreamService } = require('./services/stream-service');
const { TranscriptionService } = require('./services/transcription-service');
const { TextToSpeechService } = require('./services/tts-service');

var mongourl = process.env.MONGODB_URL;
const mongoclient = new MongoClient(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();
const expressWs = ExpressWs(app);

// Set the directory for static files (like CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse application/json
app.use(express.json());

const PORT = process.env.PORT || 3000;

// // Make a call
function makeACall(toNumber) {
  console.log("Making a call")
  const calls = client.calls.create({
    twiml: `<Response>
    <Connect>
    <Stream url="wss://${process.env.SERVER}/connection" />
  </Connect>
  </Response>`,
  to: toNumber,
  from: process.env.FROM_NUMBER,
  // record: true
});
console.log("Call successfully made: ", calls)
}

app.post('/incoming', (req, res) => {
  res.status(200);
  res.type('text/xml');
  res.end(`
  <Response>
    <Connect>
      <Stream url="wss://${process.env.SERVER}/connection" />
    </Connect>
  </Response>
  `);
});

const gptService = new GptService();

app.post("/set_prompt", async (req, res) => {
  const formBody = await req.body

  console.log(formBody);
  const prompt = formBody["prompt"]
  const name = formBody["name"]
  const email = formBody["email"]
  const phone = formBody["phone"].replaceAll(" ", "")

  try {
    const insertedId = await insertDataIntoCollection(name, email, phone, prompt);
    console.log("Data inserted successfully with _id:", insertedId);
  } catch (error) {
    console.error("Error inserting data:", error);
  }

  // Setting the GPT prompt
  gptService.setPrompt(prompt)

  await makeACall(phone)

  res.send(true)
})

async function insertDataIntoCollection(name, email, phone, prompt) {
  try {
    // Assuming `client` is already defined and connected to MongoDB
    const database = mongoclient.db(); // Get the default database from the client
    const collection = database.collection('CallTrials'); // Get the collection

    // Create the document to be inserted
    const document = {
      name: name,
      email: email,
      phone: phone,
      prompt: prompt
    };

    // Insert the document into the collection
    const result = await collection.insertOne(document);
    console.log(`Inserted data with _id: ${result.insertedId}`);
    return result.insertedId; // Return the inserted document's _id
  } catch (error) {
    console.error("Error inserting data into collection:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
}

// Define a route to render the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'templates', 'index.html'));
});

app.get('/test', (req, res) => {
  res.send("Hello!");
});

expressWs.app.ws('/connection', (ws, req) => {
  ws.on('error', console.error);
  // Filled in from start message
  let streamSid;
  let callSid;

  const streamService = new StreamService(ws);
  const transcriptionService = new TranscriptionService();
  const ttsService = new TextToSpeechService({});
  
  let marks = [];
  let interactionCount = 0;

  // Incoming from MediaStream
  ws.on('message', function message(data) {
    const msg = JSON.parse(data);
    if (msg.event === 'start') {
      streamSid = msg.start.streamSid;
      callSid = msg.start.callSid;
      streamService.setStreamSid(streamSid);
      gptService.setCallSid(callSid);
      console.log(`Twilio -> Starting Media Stream for ${streamSid}`.underline.red);
      ttsService.generate({partialResponseIndex: null, partialResponse: "Hello! how can I assist you today?"}, 1);
    } else if (msg.event === 'media') {
      transcriptionService.send(msg.media.payload);
    } else if (msg.event === 'mark') {
      const label = msg.mark.name;
      console.log(`Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`.red);
      marks = marks.filter(m => m !== msg.mark.name);
    } else if (msg.event === 'stop') {
      console.log(`Twilio -> Media stream ${streamSid} ended.`.underline.red);
    }
  });

  transcriptionService.on('utterance', async (text) => {
    // This is a bit of a hack to filter out empty utterances
    if(marks.length > 0 && text?.length > 5) {
      console.log('Twilio -> Interruption, Clearing stream'.red);
      ws.send(
        JSON.stringify({
          streamSid,
          event: 'clear',
        })
      );
    }
  });

  transcriptionService.on('transcription', async (text) => {
    if (!text) { return; }
    console.log(`Interaction ${interactionCount} – STT -> GPT: ${text}`.yellow);
    gptService.completion(text, interactionCount);
    interactionCount += 1;
  });
  
  gptService.on('gptreply', async (gptReply, icount) => {
    console.log(`Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`.green );
    ttsService.generate(gptReply, icount);
  });

  ttsService.on('speech', (responseIndex, audio, label, icount) => {
    console.log(`Interaction ${icount}: TTS -> TWILIO: ${label}`.blue);

    streamService.buffer(responseIndex, audio);
  });

  streamService.on('audiosent', (markLabel) => {
    marks.push(markLabel);
  });
});

mongoclient.connect(mongourl)
.then(async () => {
  console.log("Connected to MongoDB");
  const database = mongoclient.db(); // This will use the default database specified in the connection string

  // Check if the "CallTrials" collection exists
  const collections = await database.listCollections({ name: 'CallTrials' }).toArray();
  if (collections.length === 0) {
    // If the collection doesn't exist, create it
    await database.createCollection('CallTrials');
    console.log("Created collection 'CallTrials'");
  } else {
    console.log("Collection 'CallTrials' already exists");
  }

  // Start your Express app after ensuring the collection is created
  const server = app.listen(PORT, () => {
    console.log("App is listening on port:", PORT);
  });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});