const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
// const Token = require()

const countryBasedCategorizationSchema = new Schema({
  country: {
    type: String,
    value: ""
  },
  region: [String]
})

const approvalSchema = new Schema({
  name: String,
  providerId: String,
  Description: String,
})

const priceRangeSchema = new Schema({
  high: {
    type: Number
  },
  low: {
    type: Number
  }
})

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
  },
  categories: {
    food: [String],
    flavour: [String],
    time: [String],
    specialOccasions: [String],
    foodType: [String],
    specialRequirements: [String],
    spices: [String],
    origin: [String],
    allergy: [String],
    nutrition: [String],
    mainIngredient: [String],
  },
  approval: [Schema.Types.Mixed]
},{strict: false});

const Config = mongoose.model('Config', configSchema)
module.exports = Config;