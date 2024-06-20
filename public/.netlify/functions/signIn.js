const mongoose = require("mongoose");
const User = require("../../../models/userModel");

// MongoDB connection string
const mongourl = "14871d64-f32b-4b38-9ffc-176289005420"; // Replace with your actual MongoDB connection string

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

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
