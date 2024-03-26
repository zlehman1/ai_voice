require('dotenv').config();
require('colors');
const express = require('express');
const ExpressWs = require('express-ws');
const path = require('path');

const { GptService } = require('./services/gpt-service');
const { StreamService } = require('./services/stream-service');
const { TranscriptionService } = require('./services/transcription-service');
const { TextToSpeechService } = require('./services/tts-service');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();
// ExpressWs(app);

// Set the directory for static files (like CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse application/json
app.use(express.json());

const PORT = process.env.PORT || 3000;

// // Make a call
function makeACall() {
  console.log("Making a call")
  const calls = client.calls.create({
    twiml: `<Response>
    <Connect>
    <Stream url="wss://ai-voice-three.vercel.app/connection" />
  </Connect>
  </Response>`,
  to: process.env.YOUR_NUMBER,
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
      <Stream url="wss://ai-voice-three.vercel.app/connection" />
    </Connect>
  </Response>
  `);
});

const gptService = new GptService();

app.post("/set_prompt", async (req, res) => {
  const formBody = await req.body
  const prompt = formBody["prompt"]

  // Setting the GPT prompt
  gptService.setPrompt(prompt)

  await makeACall()

  res.send(true)
})

// Define a route to render the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'templates', 'index.html'));
});

app.get('/test', (req, res) => {
  res.send("Hello!");
});
// app.ws('/connection', (ws) => {
//   ws.on('error', console.error);
//   // Filled in from start message
//   let streamSid;
//   let callSid;

//   const streamService = new StreamService(ws);
//   const transcriptionService = new TranscriptionService();
//   const ttsService = new TextToSpeechService({});
  
//   let marks = [];
//   let interactionCount = 0;

//   // Incoming from MediaStream
//   ws.on('message', function message(data) {
//     const msg = JSON.parse(data);
//     if (msg.event === 'start') {
//       streamSid = msg.start.streamSid;
//       callSid = msg.start.callSid;
//       streamService.setStreamSid(streamSid);
//       gptService.setCallSid(callSid);
//       console.log(`Twilio -> Starting Media Stream for ${streamSid}`.underline.red);
//       ttsService.generate({partialResponseIndex: null, partialResponse: "Hello! how can I assist you today?"}, 1);
//     } else if (msg.event === 'media') {
//       transcriptionService.send(msg.media.payload);
//     } else if (msg.event === 'mark') {
//       const label = msg.mark.name;
//       console.log(`Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`.red);
//       marks = marks.filter(m => m !== msg.mark.name);
//     } else if (msg.event === 'stop') {
//       console.log(`Twilio -> Media stream ${streamSid} ended.`.underline.red);
//     }
//   });

//   transcriptionService.on('utterance', async (text) => {
//     // This is a bit of a hack to filter out empty utterances
//     if(marks.length > 0 && text?.length > 5) {
//       console.log('Twilio -> Interruption, Clearing stream'.red);
//       ws.send(
//         JSON.stringify({
//           streamSid,
//           event: 'clear',
//         })
//       );
//     }
//   });

//   transcriptionService.on('transcription', async (text) => {
//     if (!text) { return; }
//     console.log(`Interaction ${interactionCount} – STT -> GPT: ${text}`.yellow);
//     gptService.completion(text, interactionCount);
//     interactionCount += 1;
//   });
  
//   gptService.on('gptreply', async (gptReply, icount) => {
//     console.log(`Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`.green );
//     ttsService.generate(gptReply, icount);
//   });

//   ttsService.on('speech', (responseIndex, audio, label, icount) => {
//     console.log(`Interaction ${icount}: TTS -> TWILIO: ${label}`.blue);

//     streamService.buffer(responseIndex, audio);
//   });

//   streamService.on('audiosent', (markLabel) => {
//     marks.push(markLabel);
//   });
// });

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
