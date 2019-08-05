const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusToken = new Schema({
  
})

const AdvtSchema = new Schema({
  userId: String,
  startDate: String,
  endDate: String,
  visibility: String,
  price: Number,
  photos: [],
  status: {type: String, default: "Active"}
}, { strict: false });

const advertisement = mongoose.model('Advertisement', AdvtSchema)
module.exports = advertisement;

//create a status token to indicate life of a plan.