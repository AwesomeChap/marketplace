const Token = require('../db/models/token');
const User = require('../db/models/user');
const Config = require('../db/models/config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport'); // this is important
const mongoose = require('mongoose');

const isAnyKeyAbsent = (obj) => {
  Object.keys(obj).forEach(key => {

    if (obj[key] === "" || obj[key] === undefined || obj[key] === null) return true;

    if (typeof obj[key] === 'object') {
      isAnyKeyAbsent(obj[key])
    }
  })
}

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


        Config.find({}).then((configs) => {
          if (!configs.length || !configs[0].mail) {
            return res.status(400).json({ message: "Mail configuration not found" })
          }
          if (isAnyKeyAbsent(configs[0].mail)) {
            return res.statud(400).json({ message: "Mail service is not configured" });
          }
          else if (configs[0].mail) {
            const mailConfig = configs[0].mail;

            const { smtpConfig, mailOptions } = mailConfig;

            var transporter = nodemailer.createTransport(smtpTransport(smtpConfig));
        
            const { from, subject, text } = mailOptions;
            const { salutation, body, close} = text; 

            const bodyWithToken = body.replace(/{{token}}/gi,token.token);

            var _mailOptions_ = {
              from, to: user.local.email, subject,
              text: salutation + '\n\n' + bodyWithToken + '\n\n' + close + '\n'
            };

            transporter.sendMail(_mailOptions_, function (err) {
              if (err) { console.log(err); return res.status(500).send({ msg: err.message }); }

              // return res.status(200).json({ type: "info", message: "An email with verification link is sent to your inbox." })
              return res.status(200).send({ message: 'Verification token sent to your email.' });
            });

          }
        })
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
    if (!token) {
      return res.status(400).json({ message: "Invalid Token!" });
    }
    else {
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

const uploadFile = (req, res, next) => {
  const {body} = req;
  console.log(req.files);
}

module.exports = { resendTokenPost, confirmationPost, verifyToken, resetPassword, checkVerifyUser, uploadFile }