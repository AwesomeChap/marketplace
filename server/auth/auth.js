const express = require('express')
const router = express.Router()
const User = require('../db/models/user')
const passport = require('../passport')

router.get('/user', (req, res, next) => {
	if (req.user) {
		User.findOne({ 'local.email': req.user.local.email }, (err, user) => {
			if (user) {
				const freshUser = {...JSON.parse(JSON.stringify(user))}
				console.log(freshUser.local.email);
				delete freshUser.local.password;
				return res.status(200).json({
					message: "User found!",
					user : freshUser
				})
			}
		})
	}
	else {
		return res.status(200).json({
			message: "User not found",
			user: null
		})
	}

})

router.post('/login', passport.authenticate('local'), (req, res) => {

	const user = JSON.parse(JSON.stringify(req.user))
	const freshUser = { ...user }

	if (freshUser.local) {
		delete freshUser.local.password;
	}

	res.status(200).json({ message: `Logged in as ${user.name.first}`, user: freshUser });
}
)

router.post('/logout', (req, res) => {

	if (req.user) {
		req.session.destroy();
		res.clearCookie('connect.sid');
		return res.status(200).json({ message: 'You have logged out sucessfully' });
	}

	return res.status(500).json({ message: 'Unable to process your request' });
})

router.post('/signup', (req, res) => {
	const { name, email, password } = req.body;
	console.log('req.body', { name, email, password });

	User.findOne({ 'local.email': email }, (err, user) => {
		if (user) {
			return res.status(200).json({
				error: 'Email already registered!'
			})
		}

		const userData = {
			name,
			local: {
				email, password
			}
		}

		const newUser = new User({ ...userData })

		newUser.save((err, savedUser) => {
			if (err) return res.status(200).json({ error: "Some error occured", err });
			return res.status(200).json({
				message: "Signup successful!",
				user: savedUser
			});
		})
	})
})

module.exports = router
