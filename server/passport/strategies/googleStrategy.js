const User = require('../../db/models/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    User.findOne({ 'google.id': profile.id }).then((user) => {
      if (user) {
        done(null, user);
      }
      else {
        const newUser = {
          google: {
            id: profile.id,
            name: {
              first: profile.name.givenName,
              last: profile.name.familyName
            },
            email: profile.emails[0].value,
            photo : profile.photos[0].value
          }
        }

        new User({...newUser}).save().then(user => {
          if(user){
            done(null, user);
          }
          else{
            done(null, false);
          }
        })
      }
    }).catch(e => done(e));
  }
);

module.exports = googleStrategy;