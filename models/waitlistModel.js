const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const waitlistSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        company: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Number, default: Date.now(),
        }
    }
)

module.exports = mongoose.model('waitlistDB', waitlistSchema);
