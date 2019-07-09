const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
// const Token = require()

const configSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  mail: {
    smtpConfig: {
      host: { type: String, required: true },
      port: { type: Number },
      secure: { type: Boolean },
      auth: {
        user: { type: String, required: true },
        pass: { type: String, required: true }
      },
    },
    mailOptions: {
      from: { type: String, required: true },
      subject: { type: String, default: 'Account Verification Token' },
      text: {
        salutation: { type: String, default: "Hello," },
        body: { type: String, default: 'Your verification token is {{token}}' },
        close: { type: String, default: "Thanks" }
      }
    }
  }
});

const Config = mongoose.model('Config', configSchema)
module.exports = Config;