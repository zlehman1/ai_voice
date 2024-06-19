require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const interviewReport = async function () {
    return "Your interview report says that you did amazing!"
    // await client.messages
    //   .create({ from: process.env.FROM_NUMBER, body: 'Ahoy, world!', to: process.env.YOUR_NUMBER })
    //   .then(message => console.log(message.sid));
};

module.exports = interviewReport;