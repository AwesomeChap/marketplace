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
  },
  categories: {},
  ingredients: {
    values: [],
    approval: [],
    colData: [],
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
    values: {
      type: Array,
      default: ["Courier Classes", "Registered Couriers"]
    },
    courierClasses: {
      values: [],
      colData: [],
      approval: []
    },
    registeredCouriers: {
      values: [],
      colData: [],
    }
  },
  payment: {
    id: { type: String },
    secret: { type: String }
  },
  faq: []
}, { strict: false });

const Config = mongoose.model('Config', configSchema)
module.exports = Config;