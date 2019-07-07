const Token = require('../db/models/token');
const User = require('../db/models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const confirmationPost = function (req, res, next) {
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (!token) return res.status(400).send({ message: 'This token is expired' });

    User.findOne({ _id: token._userId }, function (err, user) {
      if (!user) return res.status(400).send({ message: 'We were unable to find a user for this token.' });
      if (user.isVerified) return res.status(400).send({ message: 'This user has already been verified.' });

      User.findByIdAndUpdate(user._id, { isVerified: true }, { new: true }, function (err, user) {
        if (err) {
          return res.send(500).json({ message: "Some error occured while updating data" });
        }
        res.status(200).json({ message: "Email verified successfully!" });
      })
    });
  });
};

const resendTokenPost = function (req, res, next) {

  if (!req.body.email) return res.status(400).json({ message: "Email required!", errors });

  User.findOne({ 'local.email': req.body.email }, function (err, user) {

    if (!user) return res.status(400).send({ message: 'Email not registered!' });

    if (!req.body.passReset) {
      if (user.isVerified) return res.status(400).send({ message: 'Verified already. You can log in' });
    }

    Token.findOne({ _userId: user._id }, async function (err, token) {
      if (token) {
        await Token.findOneAndDelete({ _userId: token._userId });
      }
      // Create a verification token, save it, and send email
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the token
      token.save(function (err) {
        if (err) { return res.status(500).send({ message: err.message }); }

        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use SSL
          auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
          }
        });

        var mailOptions = {
          from: 'no-reply@marketplace.com',
          to: user.local.email,
          subject: 'Account Verification Token',
          text: 'Hello,\n\n' + 'Your verificatin token is : ' + token.token + '\n'
        };

        transporter.sendMail(mailOptions, function (err) {
          if (err) { console.log(err); return res.status(500).send({ msg: err.message }); }

          // return res.status(200).json({ type: "info", message: "An email with verification link is sent to your inbox." })
          return res.status(200).send({ message: 'Verification token sent to your email.' });
        });

      });
    })
  });
};

const checkVerifyUser = function (req, res, next) {
  const { email } = req.body;
  User.findOne({ 'local.email': email }, function (err, user) {
    if (err) {
      return res.status(400).send({ message: "User not found" });
    }
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials!" })
    }
    else {
      if (user.isVerified) {
        return res.status(200).json({ message: "User is verified" });
      }
      else {
        return res.status(401).json({ type: "warning", message: "User not verified" });
      }
    }
  })
}

const verifyToken = function (req, res, next) {
  const id = req.body.token._userId;
  User.findOne({ _id: mongoose.Types.ObjectId(id) }, function (err, user) {
    console.log(user);
    if (user.isVerified) {
      res.status(200).json({ verify: true });
    }
    else {
      res.status(404).json({ verify: false });
    }
  })
}

const resetPassword = function (req, res, next) {
  const { email, password, token } = req.body;
  Token.findOne({ token }, function (err, token) {
    if (err) {
      return res.status(500).json({ message: "Some error occured while finding token", error: err });
    }
    if(!token){
      return res.status(400).json({message: "Invalid Token!"});
    }
    else{
      User.findById(token._userId, function (err, user) {
        if (err) {
          return res.status(500).json({ message: "Some error occured while finding user", error: err });
        }

        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }

        user.local.password = password;

        user.save((err, user) => {
          if (err) return res.status(500).json({ message: "Unable to updated data" });

          return res.status(200).json({ message: "Password updated" });
        })
      })
    }
  })
}

module.exports = { resendTokenPost, confirmationPost, verifyToken, resetPassword, checkVerifyUser }