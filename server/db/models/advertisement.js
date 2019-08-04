const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvtSchema = new Schema({
  userId: String,
  startDate: String,
  endDate: String,
  visibility: String,
  price: Number,
  images: [],
  status: {type: String, default: "Active"}
}, { strict: false });

const advertisement = mongoose.model('Advertisement', AdvtSchema)
module.exports = advertisement;