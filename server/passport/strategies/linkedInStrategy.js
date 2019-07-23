const User = require('../../db/models/user');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

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
  scope: ['r_emailaddress', 'r_liteprofile'],
  state: true
}, function(token, tokenSecret, profile, done) {
  process.nextTick(function () {
    // console.log(JSON.stringify(profile, undefined, 4));
    User.findOne({ 'linkedin.id': profile.id }).then((user) => {
      if (user) {
        return done(null, user);
      }
      else {
        const newUser = {
          linkedin: {
            id: profile.id,
            name: {
              first: profile.name.givenName,
              last: profile.name.familyName
            },
            email: profile.emails[0].value,
            photo : profile.photos[0].value
          }
        }

        const email = profile.emails[0].value;
        User.findOne({$or: [{ 'local.email': email }, { 'google.email': email }, { 'facebook.email': email }]}).then((user) => {
          if (!user) {
            new User({ ...newUser }).save().then(user => {
              if (user) {
                done(null, user);
              }
              else {
                done(null, false);
              }
            })
          }
          else {
            User.findByIdAndUpdate(user._id, {linkedin: newUser.linkedin}).then((user) => {
              if(user){
                done(null, user);
              }
              else{
                done(null, false);
              }
            })
          }
        })
      }
    }).catch(e => done(e));
    // return done(null, profile);
  });
})

module.exports = linkedInStrategy;