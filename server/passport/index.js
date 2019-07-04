const passport = require('passport')
const LocalStrategy = require('./strategies/localStrategy')
const User = require('../db/models/user')

passport.serializeUser((user, done) => {
	done(null, { _id: user._id })
})

passport.deserializeUser((id, done) => {
	User.findOne({ _id: id }, 'firstName lastName photos local.email', (err, user) => {done(null, user)});
})

passport.use(LocalStrategy)

module.exports = passport
