const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
var LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const CampaignsDB = require("../models/campaignsModel");
const LeadsDB = require("../models/leadsModel");
const bodyParser = require("body-parser");
const localUrl = "http://127.0.0.1:5000";
const { MongoClient } = require('mongodb');
const connectEnsureLogin = require("connect-ensure-login");
const {randomBytes} = require("crypto")

const generateToken = () => {
  return randomBytes(20).toString("hex");
};

var mongourl = process.env.MONGODB_URL;
const mongoclient = new MongoClient(mongourl);

const router = express.Router();

router.use(express.static(path.join(__dirname, "public")));

router.get('/:campaignId/dashboard', connectEnsureLogin.ensureLoggedIn("/accounts/sign-in"), async (req, res) => {
    const {campaignId} = req.params
    if(campaignId) {
      const validateCampaignId = await CampaignsDB.findOne({user_id: req.user._id, campaign_id: campaignId})
      if(validateCampaignId) {
        res.sendFile(path.join(__dirname, "../", 'public', 'templates', 'dashboard.html'));
      } else {
        res.redirect("/panel/campaigns")
      }
    } else {
      res.redirect("/panel/campaigns")
    }
  });

  router.get('/campaigns', connectEnsureLogin.ensureLoggedIn("/accounts/sign-in"), (req, res) => {
    res.sendFile(path.join(__dirname, "../", 'public', 'templates', 'campaigns.html'));
  });

router.get('/:campaignId/interactions', connectEnsureLogin.ensureLoggedIn("/accounts/sign-in"), async (req, res) => {
  const {campaignId} = req.params
  if(campaignId) {
    const validateCampaignId = await CampaignsDB.findOne({user_id: req.user._id, campaign_id: campaignId})
    if(validateCampaignId) {
      res.sendFile(path.join(__dirname, "../", 'public', 'templates', 'interactions.html'));
    } else {
      res.redirect("/panel/campaigns")
    }
  } else {
    res.redirect("/panel/campaigns")
  }
});

// router.get('/leads', connectEnsureLogin.ensureLoggedIn("/accounts/sign-in"), (req, res) => {
//   res.sendFile(path.join(__dirname, "../", 'public', 'templates', 'leads.html'));
// });

router.get('/:campaignId/leads', connectEnsureLogin.ensureLoggedIn("/accounts/sign-in"), async (req, res) => {
  const {campaignId} = req.params
  if(campaignId) {
    const validateCampaignId = await CampaignsDB.findOne({user_id: req.user._id, campaign_id: campaignId})
    if(validateCampaignId) {
      const leadsData = await LeadsDB.find({user_id: req.user._id, campaign_id: campaignId})
      res.render(path.join(__dirname, "../", 'public', 'templates', 'leads.html'), {leadsData: leadsData});
    } else {
      res.redirect("/panel/campaigns")
    }
  } else {
    res.redirect("/panel/campaigns")
  }
});

router.get('/createcampaign', connectEnsureLogin.ensureLoggedIn("/accounts/sign-in"), (req, res) => {
  res.sendFile(path.join(__dirname, "../", 'public', 'templates', 'createcampaign.html'));
});

router.post("/createcampaign", connectEnsureLogin.ensureLoggedIn("/accounts/sign-in"), async(req, res) => {
  try {
    console.log(req.body)
    // user validate
    if(User.findOne({user_id: req.user._id})) {
      // generate campaign id
      var campaignId = generateToken()
      console.log(campaignId)

      if(!await CampaignsDB.findOne({campaign_id: campaignId})) {
        var campaignData = {"user_id": req.user._id, "campaign_id": campaignId, "campaign_name": req.body.campaign_name, "ai_name": req.body.ai_name, "ai_voice": req.body.ai_voice, "ai_prompt": req.body.ai_prompt, "ai_initial_message": req.body.ai_initial_message}
        await CampaignsDB.create(campaignData)

        if(req.body.leads_data) {
          await saveBulkLeads(req.user._id, campaignId, req.body.leads_data)
        }
        
        return res.send(true)
      } else {
        console.log("Campaigns data already exists")
        console.log(await CampaignsDB.find())
        return res.send(false)
      }
    } else {
      console.log("Invalid user")
      return res.send(false)
    }
  } catch (error) {
    console.log("Internal server error.", String(error))
    return res.send(false)
  }
})

async function saveBulkLeads(user_id, campaign_id, leads_data) {
  if("Name" in leads_data && "Country Code" in leads_data && "Phone" in leads_data) {
    for(let y = 0; y < leads_data["Name"].length; y++) {
      var leadName = leads_data["Name"][y]
      var leadCountryCode = leads_data["Country Code"][y]
      var leadPhone = leads_data["Phone"][y]
      var leadId = generateToken()
      var leadData = {"user_id": user_id, "campaign_id": campaign_id, lead_id: leadId, name: leadName, country_code: leadCountryCode, phone_number: leadPhone}
      await LeadsDB.create(leadData)
    }

    const campaignDataUpdate = await CampaignsDB.findOne({user_id: user_id, campaign_id: campaign_id})
    campaignDataUpdate.total_leads = leads_data["Name"].length
    campaignDataUpdate.save()

    return true
  }

  return false
}

router.get("/getallcampaigns", async (request, response) => {
  const campaigns = await CampaignsDB.find();
  response.json(campaigns);
});

router.get("/getcampaigns", async (request, response) => {
  const campaigns = await CampaignsDB.find({user_id: request.user._id});
  response.json(campaigns);
});

router.get("/deleteallcampaigns", async (request, response) => {
  const campaigns = await CampaignsDB.deleteMany({});
  response.json(campaigns);
});

router.get("/getallleads", async (request, response) => {
  const leads = await LeadsDB.find();
  response.json(leads);
});

router.get("/deleteallleads", async (request, response) => {
  const leads = await LeadsDB.deleteMany({});
  response.json(leads);
});

module.exports = router;