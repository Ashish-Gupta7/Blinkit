const dbgr = require("debug")("development:google-oauth");
const { userModel } = require("../models/user-model");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new userModel({
            name: profile.displayName,
            email: profile.emails[0].value,
          });

          await user.save();
        }
        cb(null, user);
      } catch (err) {
        dbgr(`Error during GoogleStrategy: ${err.message}`);
        cb(err, false);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    let user = await userModel.findOne({ _id: id });
    if (!user) {
      return cb(new Error("User not found"), null);
    }
    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
});

module.exports = passport;
