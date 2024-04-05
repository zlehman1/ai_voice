const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
var LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const bodyParser = require("body-parser");
const localUrl = "http://127.0.0.1:5000";
const { MongoClient } = require('mongodb');
const connectEnsureLogin = require("connect-ensure-login");

var mongourl = process.env.MONGODB_URL;
const mongoclient = new MongoClient(mongourl);

const router = express.Router();

router.use(express.static(path.join(__dirname, "public")));

router.get('/dashboard', connectEnsureLogin.ensureLoggedIn("/accounts/sign-in"), (req, res) => {
    res.sendFile(path.join(__dirname, "../", 'public', 'templates', 'dashboard.html'));
  });

  router.get('/interactions', (req, res) => {
    res.sendFile(path.join(__dirname, "../", 'public', 'templates', 'interactions.html'));
  });

  router.get('/leads', (req, res) => {
    res.sendFile(path.join(__dirname, "../", 'public', 'templates', 'leads.html'));
  });

  module.exports = router;