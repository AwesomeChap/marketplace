const User = require('../../db/models/user');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const linkedInStrategy = new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: "/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
  console.log(profile);
})

module.exports = linkedInStrategy;