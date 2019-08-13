const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  name: String,
  url: String
}, { strict: false });

const image = mongoose.model('Image', ImageSchema)
module.exports = image;