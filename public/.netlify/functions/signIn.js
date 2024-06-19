const mongoose = require("mongoose");
const User = require("../../../models/userModel");
require('dotenv').config();

const mongourl = process.env.MONGODB_URL;

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

exports.handler = async (event, context) => {
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "All fields are required." }),
    };
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      const result = password === user.password;
      if (result) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Successfully logged in" }),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Password does not match" }),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User does not exist" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
