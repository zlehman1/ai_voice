const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const campaignsSchema = mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        campaign_id: {
            type: String,
            required: true,
        },
        campaign_name: {
            type: String,
            required: true,
        },
        ai_name: {
            type: String,
            required: true,
        },
        ai_prompt: {
            type: String,
        },
        ai_voice: {
            type: String,
        },
        ai_initial_message: {
            type: String,
        },
        total_leads: {
            type: Number,
            default: 0,
        },
        total_calls: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Number, default: Date.now(),
        },
    }
)

module.exports = mongoose.model('CampaignsDB', campaignsSchema);
