const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const leadsSchema = mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        campaign_id: {
            type: String,
            required: true,
        },
        lead_id: {
            type: String,
            required: true,    
        },
        name: {
            type: String,
            required: true,    
        },
        country_code: {
            type: Number,
            required: true,    
        },
        phone_number: {
            type: Number,
            required: true,    
        },
        createdAt: {
            type: Number, default: Date.now(),
        },
    }
)

module.exports = mongoose.model('LeadsDB', leadsSchema);
