const passport = require('passport')
const LocalStrategy = require('./strategies/localStrategy')
const User = require('../db/models/user')

passport.serializeUser((user, done) => {
	done(null, { _id: user._id })
})

passport.deserializeUser((id, done) => {
	User.findOne({ _id: id }, 'name.first name.last local.email', (err, user) => {done(null, user)});
})

passport.use(LocalStrategy)

module.exports = passport
