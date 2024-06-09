require('dotenv').config();
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

var mongourl = process.env.MONGODB_URL;
const mongoclient = new MongoClient(mongourl);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${localUrl}/accounts/google/callback`,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.email }).then((user) => {
        if (!user) {
          user = new User({
            name: profile.given_name,
            email: profile.email,
            password: profile.id,
            company: "",
            isGoogle: true,
            googleId: profile.id,
          });
          user.save().then((err) => {
            if (err) console.log(err);
            done(null, user);
          });
        } else {
          console.log("Here");
          done(null, user);
        }
      });
    }
  )
);

passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async function (email, password, done) {
        const user = await User.findOne({ email });
        try {
          if (!user) return done(null, false);
  
          if (user.password !== password) return done(null, false);
  
          return done(null, user);
        } catch (error) {
          console.log("Error")
          return done(error, false);
        }
      }
    )
  );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const router = express.Router();

router.use(express.static(path.join(__dirname, "public")));

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/panel/home",
    failureRedirect: "/accounts/google/failure",
  })
);

router.get("/google/failure", (request, response) => {
  response.send(
    "Something went wrong. <a href='/accounts/signin'>Try again</a>"
  );
});

router.get("/sign-in", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "templates", "login.html")
  );
});

router.get("/sign-up", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "templates", "signup.html")
  );
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Route to save a User
router.post("/sign-up", async (request, response) => {
  console.log(request.body)
  try {
    if (
      !request.body.name ||
      !request.body.company ||
      !request.body.email ||
      !request.body.password
    ) {
      return response.status(400).send({
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email: request.body.email });
    if (user) {
      response.status(400).send({ message: "Email already in use" });
    } else {
      const newUser = {
        name: request.body.name,
        company: request.body.company,
        email: request.body.email,
        password: request.body.password,
      };

      request.session.signup_email = request.body.email;
      console.log(request.session);

      const createUser = await User.create(newUser);

      return response
        .status(201)
        .send({ message: "Account successfully created" });
    }
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.post('/sign-in', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
  console.log(req.user)
  res.send(true)
	// res.redirect('/accounts/protected');
});

//Handling user login
router.post("/sign-in", async function (request, response) {
  console.log(request.body.email);
  console.log(request.body.password);
  try {
    if (!request.body.email || !request.body.password) {
      return response.send(400).send({
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email: request.body.email });
    if (user) {
      const result = request.body.password === user.password;
      if (result) {
        request.session.user = user;

        response.status(201).send({ message: "Successfully logged in" });
      } else {
        response.status(400).send({ message: "Password does not match" });
      }
    } else {
      response.status(400).send({ message: "User does not exist" });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});


router.get("/getallusers", async (request, response) => {
  const users = await User.find();
  response.json(users);
});

router.get("/deleteallusers", async (request, response) => {
  const users = await User.deleteMany({});
  response.json(users);
});

module.exports = router;
