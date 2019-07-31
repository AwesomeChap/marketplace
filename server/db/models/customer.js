const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Seller = require('./seller');

const CustomerConfigSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  _sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Seller'
  },

  paypal: {}
}, { strict: false });

const customerConfig = mongoose.model('Customer', CustomerConfigSchema)
module.exports = customerConfig;