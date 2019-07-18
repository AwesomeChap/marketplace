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

const basicSchema = new Schema({
  name: String,
  description: String,
})

const approvalSchema = new Schema({
  name: String,
  providerId: String,
  Description: String,
})

const fooProviderDetailsSchema = new Schema({
  id: String,
  pendingRequest: Number,
  status: String,
  key: String
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
    values: [],
    approval: []
  },
  flavours: {
    values: [],
    approval: [],
    colData: [],
  },
  time: {
    values: [],
    approval: [],
    colData: [],
  },
  nutrition: {
    values: [],
    approval: [],
    colData: [],
  },
  spices: {
    values: [],
    approval: [],
    colData: [],
  },
  allergy: {
    values: [],
    approval: [],
    colData: [],
  },
  priceRange: {
    values: [],
    approval: [],
    colData: [],
  },
  foodProvider: {
    values: []
  },
  order: {
    values: []
  },
  complain: {
    values: []
  },
  commission: {
    values: []
  },
  advertisement: {
    values: {
      type: Array,
      default: ["Add Pricing", "Subscribed Sellers"]
    },
    addPricing: {
      values: [],
      colData: []
    },
    subscribedSellers: {
      values: [],
      colData: []
    }
  },
  customer: {
    values: [],
    colData: []
  },
  courier: {
    values: [],
    colData: [],
    approval: []
  },
  payment: {
    id: { type: String },
    secret: { type: String }
  }
}, { strict: false });

const Config = mongoose.model('Config', configSchema)
module.exports = Config;