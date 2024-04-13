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
        campaign_type: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Number, default: Date.now(),
        },
    }
)

module.exports = mongoose.model('CampaignsDB', campaignsSchema);
