const User = require('../../db/models/user');
var LinkedInStrategy = require('@sokratis/passport-linkedin-oauth2').Strategy;

const linkedInStrategy = new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: "/auth/linkedin/callback",
  profileFields: [
    "first-name",
    "last-name",
    "email-address",
    "picture-url",
  ],
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function(token, tokenSecret, profile, done) {
  process.nextTick(function () {
    // console.log(profile);
    return done(null, profile);
  });
})

module.exports = linkedInStrategy;