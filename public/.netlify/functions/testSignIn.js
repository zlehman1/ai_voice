const mongoose = require("mongoose");
const User = require("../../../models/userModel");

const mongourl = "mongodb://localhost:27017/test"; // Mock MongoDB URL for local testing

if (!mongourl.startsWith("mongodb://") && !mongourl.startsWith("mongodb+srv://")) {
  console.error("Invalid MongoDB connection string:", mongourl);
  throw new Error("Invalid MongoDB connection string");
}

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

const mockEvent = {
  body: JSON.stringify({
    email: "test@example.com",
    password: "password"
  })
};

const context = {};

const { handler } = require("./signIn");

handler(mockEvent, context).then(response => {
  console.log("Response:", response);
}).catch(error => {
  console.error("Error:", error);
});
