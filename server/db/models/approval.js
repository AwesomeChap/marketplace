const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApprovalSchema = new Schema({
  userId: String,
  option: String,
  data: {},
  date: String,
  status: {type: String, default: "pending"}
}, { strict: false });

const approval = mongoose.model('Approval', ApprovalSchema)
module.exports = approval;