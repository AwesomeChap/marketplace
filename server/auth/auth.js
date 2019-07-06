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
// Email verification
// Forgot Password
// Oauth login
// save lowercase emails to DB
// remember me
// disable other buttons when user clickes one button

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

// router.post('/login', passport.authenticate('local'), (req, res) => {
// 	const user = JSON.parse(JSON.stringify(req.user))
// 	const freshUser = { ...user }

// 	console.log(req.body);

// 	console.log(user);

// 	if (req.body.remember) {
// 		req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
// 	} else {
// 		req.session.cookie.expires = false; // Cookie expires at end of session
// 	}

// 	if (freshUser.local) {
// 		delete freshUser.local.password;
// 	}

// 	User.findOne({ 'local.email': req.body.email }, function (err, user) {
// 		if (!user.isVerified)
// 			return res.status(400).json({ message: 'Your account has not been verified.' });
// 		else
// 			return res.status(200).json({ message: `Logged in as ${freshUser.name.first}`, user: freshUser });
// 	});

// })

router.post('/login', function (req, res, next) {

		if (req.body.remember) {
			req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
		} else {
			req.session.cookie.expires = false; // Cookie expires at end of session
		}

	passport.authenticate('local', function (err, user, info) {
		if (err) { return next(err); }

		if (!user) { return res.status(401).json({ message: "Invalid login credentials" }); } // failure

		if (!user.isVerified) {
			axios.post(`http://${req.headers.host}/auth/resendVerificationLink`, {
				email: user.local.email
			}).then(({ data }) => res.status(401).json({ type: "info", message: "Verification link sent to your email." }))
				.catch(e => res.status(500).json({ message: "Your email needs verification, unable to send verification email at the moment" }))
		}

		else {
			req.logIn(user, function (err) { // success
				if (err) { return next(err); }
				const freshUser = { ...JSON.parse(JSON.stringify(user)) };
				delete freshUser.local.password;
				return res.status(200).json({ message: `Welcome ${freshUser.name.first}!`, user: freshUser })
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

		newUser.save((err, user) => {
			if (err) return res.status(500).json({ message: "Some error occured", err });
			// // Create a verification token for this user
			var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

			// // Save the verification token
			token.save(function (err) {
				if (err) { return res.status(500).send({ message: err.message }); }

				const { GMAIL_USERNAME, GMAIL_PASSWORD } = result.parsed;

				// Send the email
				var transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					auth: {
						user: GMAIL_USERNAME,
						pass: GMAIL_PASSWORD
					}
				});

				var mailOptions = {
					from: 'no-reply@marketplace.com',
					to: user.local.email,
					subject: 'Account Verification Token',
					text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/auth/confirmation?token=' + token.token + '.\n'
				};

				transporter.sendMail(mailOptions, function (err) {
					if (err) {
						return res.status(500).send({ message: err.message });
					}
					res.status(200).send({ message: 'Verification link sent'});
				});
			});
		})
	})
})

router.get('/confirmation', userController.confirmationPost);
router.post('/resendVerificationLink', userController.resendTokenPost);
router.post('/verifyToken', userController.verifyToken);

module.exports = router
