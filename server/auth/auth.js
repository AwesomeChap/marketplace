const express = require('express');
const router = express.Router();
const User = require('../db/models/user');
const passport = require('../passport');
const Token = require('../db/models/token');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userController = require('./helper');
const axios = require('axios');
const dotenv = require('dotenv');
const result = dotenv.config();

// Todo
// Oauth login
// save lowercase emails to DB

router.get('/user', (req, res, next) => {
	if (req.user) {
		User.findOne({ 'local.email': req.user.local.email }, (err, user) => {
			if (user) {
				const freshUser = { ...JSON.parse(JSON.stringify(user)) }
				delete freshUser.local.password;
				return res.status(200).json({
					message: "User found!",
					user: freshUser
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

router.post('/login', function (req, res, next) {

	console.log(req.body.email);
	
	passport.authenticate('local', function (err, user, info) {
		if (err) { return next(err); }

		if (!user) { return res.status(401).json({ message: "Invalid login credentials" }); } // failure

		if (!user.isVerified) { return res.status(401).json({ verify: false, type: "info", message: "USer not verified!" }); }

		else {
			req.login(user, { session: req.body.remember }, function (err) { // success
				if (err) { return next(err); }
				const freshUser = { ...JSON.parse(JSON.stringify(user)) };
				delete freshUser.local.password;
				return res.status(200).json({ verify: true, message: `Welcome ${freshUser.name.first}!`, user: freshUser })
			});
		}

	})(req, res, next);
});

router.post('/logout', (req, res) => {
	if (req.user) {
		req.session.destroy();
		res.clearCookie('connect.sid');
		req.logout();
		return res.status(200).json({ message: 'You have logged out sucessfully' });
	}

	return res.status(500).json({ message: 'Unable to process your request' });
})

router.post('/signup', (req, res) => {
	const { name, email, password } = req.body;

	User.findOne({ 'local.email': email }, (err, user) => {

		if (user) {
			return res.status(400).json({ message: 'Email already registered!' })
		}

		const userData = {
			name,
			local: {
				email, password
			}
		}

		const newUser = new User({ ...userData })

		newUser.save((err, user) => {
			if (err) return res.status(500).json({ message: "Some error occured", err });

			res.status(200).json({ message: "Signed up successfully" });
		})
	})
})

router.post('/confirmation', userController.confirmationPost);
router.post('/resendVerificationLink', userController.resendTokenPost);
router.post('/verifyToken', userController.verifyToken);
router.post('/resetPassword', userController.resetPassword)
router.post('/checkIfUserVerified', userController.checkVerifyUser);

module.exports = router
