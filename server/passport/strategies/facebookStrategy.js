const User = require('../../db/models/user');
const FacebookStrategy = require('passport-facebook').Strategy;

const facebookStratefgy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'emails'],
  enableProof: true
},
  function (accessToken, refreshToken, profile, done) {
    User.findOne({ 'facebook.id': profile.id }).then((user) => {
      if (user) {
        done(null, user);
      }
      else {
        const newUser = {
          facebook: {
            id: profile.id,
            name: {
              first: profile.displayName.split(' ')[0],
              last: profile.displayName.split(' ')[profile.displayName.split('').length - 1] || ""
            },
            email: profile.emails[0].value,
            photo: profile._json.picture.data.url
          }
        }
        const email = profile.emails[0].value;
        User.findOne({$or : [{ 'local.email': email }, { 'google.email': email }, { 'linkedin.email': email } ]}).then((user) => {
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
            User.findByIdAndUpdate(user._id, { facebook: newUser.facebook }).then((user) => {
              if (user) {
                done(null, user);
              }
              else {
                done(null, false);
              }
            })
          }
        })
      }
    }).catch(e => done(e));
  }
);

module.exports = facebookStratefgy;