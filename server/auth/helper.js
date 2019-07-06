const Token = require('../db/models/token');
const User = require('../db/models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const confirmationPost = function (req, res, next) {
  Token.findOne({ token: req.query.token }, function (err, token) {
    if (!token) return res.status(400).send({ message: 'We were unable to find a valid token. Your token my have expired.' });

    User.findOne({ _id: token._userId }, function (err, user) {
      if (!user) return res.status(400).send({ message: 'We were unable to find a user for this token.' });
      if (user.isVerified) return res.status(400).send({ message: 'This user has already been verified.' });

      User.findByIdAndUpdate(user._id, { isVerified: true }, { new: true }, function (err, user) {
        if (err) {
          return res.send(500).json({ message: "Some error occured while updating data" });
        }
        res.status(200).json({ message: "Account verified successfully. Now you may please log in" });
      })
    });
  });
};

const resendTokenPost = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors    
  var errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);

  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) return res.status(400).send({ message: 'We were unable to find a user with that email.' });
    if (user.isVerified) return res.status(400).send({ message: 'This account has already been verified. Please log in.' });

    // Create a verification token, save it, and send email
    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

    // Save the token
    token.save(function (err) {
      if (err) { return res.status(500).send({ message: err.message }); }

      var transporter = nodemailer.createTransport({
        service: 'Google',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD
        }
      });

      var mailOptions = {
        from: 'no-reply@marketplace.com',
        to: user.email,
        subject: 'Account Verification Token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\?token=' + token.token + '.\n'
      };

      transporter.sendMail(mailOptions, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send('A verification email has been sent to ' + user.email + '.');
      });

    });

  });
};

module.exports = { resendTokenPost, confirmationPost }