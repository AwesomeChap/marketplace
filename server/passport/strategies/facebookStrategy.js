const User = require('../../db/models/user');
const FacebookStrategy = require('passport-facebook').Strategy;

const facebookStratefgy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:8080/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
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
              first: profile.name.givenName,
              last: profile.name.familyName
            },
            email: profile.emails[0].value,
            photo: profile.photos[0].value
          }
        }

        new User({ ...newUser }).save().then(user => {
          if (user) {
            done(null, user);
          }
          else {
            done(null, false);
          }
        })
      }
    }).catch(e => done(e));
  }
);

module.exports = facebookStratefgy;