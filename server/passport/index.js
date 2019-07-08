const passport = require('passport')
const LocalStrategy = require('./strategies/localStrategy')
const GoogleStrategy = require('./strategies/googleStrategy');
const LinkedinStrategy = require('./strategies/linkedInStrategy');
const facebookStrategy = require('./strategies/facebookStrategy');
const User = require('../db/models/user')

// passport.serializeUser((user, done) => {
// 	done(null, { _id: user._id })
// })

// passport.deserializeUser((id, done) => {
// 	User.findOne({ _id: id }, 'local.name.first local.name.last local.email', (err, user) => {done(null, user)});
// })

passport.serializeUser((user, done) => {
	done(null, user);
})

passport.deserializeUser((user, done) => {
	done(null, user);
})

passport.use(LocalStrategy);
passport.use(GoogleStrategy);
passport.use(LinkedinStrategy);
passport.use(facebookStrategy);

module.exports = passport
