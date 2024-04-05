const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        company: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isGoogle: {
            type: Boolean,
        },
        googleId: {
            type: String,
        },
        isLinkedIn: {
            type: Boolean,
        },
        linkedinId: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        isActivated: {
            type: Boolean,
            default: false
        },
        activationCode: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
    }
)

userSchema.plugin(passportLocalMongoose,
    {
        usernameField: 'email'
    });

module.exports = mongoose.model('User', userSchema);
