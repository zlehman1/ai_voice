require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

async function courseEnrollment(functionArgs) {
    const courseName = functionArgs.courseName;
    console.log('GPT -> called courseEnrollment function');
    console.log(courseName)
    return "We have successfully sent you an SMS!"
  }
  
  module.exports = courseEnrollment;