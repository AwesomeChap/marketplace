const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvtStatusTokenSchema = new Schema({
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
    expires: 2419200
  }
})
const AdvtStatusToken = mongoose.model('AdvtStatusToken', AdvtStatusTokenSchema);

const AdvtSchema = new Schema({
  userId: String,
  startDate: String,
  endDate: String,
  visibility: String,
  price: Number,
  photos: [],
  status: { type: String, default: "Active" }
}, { strict: false });

const Advertisement = mongoose.model('Advertisement', AdvtSchema)
module.exports = {AdvtStatusToken, Advertisement};

//create a status token to indicate life of a plan.