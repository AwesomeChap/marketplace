const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvtStatusTokenSchema1 = new Schema({
  _advtId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Advertisement'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 2419200    // 1 month
  }
})
const AdvtStatusToken1 = mongoose.model('AdvtStatusToken1', AdvtStatusTokenSchema1);

const AdvtStatusTokenSchema2 = new Schema({
  _advtId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Advertisement'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 2419200 * 2   // 2 months
  }
})
const AdvtStatusToken2 = mongoose.model('AdvtStatusToken2', AdvtStatusTokenSchema2);

const AdvtStatusTokenSchema3 = new Schema({
  _advtId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Advertisement'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 2419200 * 3   // 3 months
  }
})
const AdvtStatusToken3 = mongoose.model('AdvtStatusToken3', AdvtStatusTokenSchema3);

const AdvtStatusTokenSchema6 = new Schema({
  _advtId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Advertisement'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 2419200 * 6   // 6 months
  }
})
const AdvtStatusToken6 = mongoose.model('AdvtStatusToken6', AdvtStatusTokenSchema6);

const AdvtStatusTokenSchema12 = new Schema({
  _advtId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Advertisement'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 2419200 * 12   // 2 months
  }
})
const AdvtStatusToken12 = mongoose.model('AdvtStatusToken12', AdvtStatusTokenSchema12);

const AdvtSchema = new Schema({
  _userId: String,
  startDate: String,
  endDate: String,
  visibility: String,
  price: Number,
  duration: {},
  photos: [],
  status: { type: String, default: "Active" }
}, { strict: false });

const Advertisement = mongoose.model('Advertisement', AdvtSchema)
module.exports = { AdvtStatusToken1, AdvtStatusToken2, AdvtStatusToken3, AdvtStatusToken6, AdvtStatusToken12, Advertisement };

//create a status token to indicate life of a plan.