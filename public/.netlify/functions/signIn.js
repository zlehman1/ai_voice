const mongoose = require("mongoose");
const User = require("../../../models/userModel");

const mongourl = process.env.MONGODB_URL;

if (mongourl) {
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
} else {
  console.warn("MONGODB_URL environment variable is not set. Skipping MongoDB connection.");
}

// Mocking User.findOne for local testing
if (!mongourl) {
  User.findOne = async ({ email }) => {
    console.log("Mock User.findOne called with email:", email);
    if (email === "test@example.com") {
      return { email: "test@example.com", password: "password" }; // Mock user data
    }
    return null;
  };
}

exports.handler = async (event, context) => {
  console.log("Handler invoked");
  const { email, password } = JSON.parse(event.body);
  console.log("Request body parsed:", { email, password });

  if (!email || !password) {
    console.log("Missing fields");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "All fields are required." }),
    };
  }

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (user) {
      const result = password === user.password;
      if (result) {
        console.log("Password match");
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Successfully logged in" }),
        };
      } else {
        console.log("Password does not match");
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Password does not match" }),
        };
      }
    } else {
      console.log("User does not exist");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User does not exist" }),
      };
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
