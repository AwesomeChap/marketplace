const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const ingredientsSchema = new Schema({
  name: String,
  upload: [],
  type: String,
  description: String,
  quantity: String
}, { strict: false })

const nutritionSchema = new Schema({
  name: String,
  type: String,
  description: String,
  quantity: String
}, { strict: false })

const sellerProfileSchema = new Schema({
  branchName: String,
  serviceOptions: [String], //dining in, take away, delivery
  photos: [],
  offers: [String],
  openingTime: String,
  closingTime: String,
  address: String,
  cateringService: {
    available: Boolean,
    coverageArea: Number,
    quantityOfFoodPerMember: Number,
    modeOfService: [String] // food is delivered, service personnel, 
  }
}, { strict: false })

const foodItemSchema = new Schema({
  name: String,
  image: [],
  type: String, // veg or non-veg
  price: Number,
  leadTime: String,
  serveTime: [String],
  category: [String],
  flavours: [String],
  recipe: [String],
  ingredients: [ingredientsSchema],
  spiceLevel: String,
  allergies: [String],
  nutrition: [nutritionSchema],
}, { strict: false })

const seatArrangementSchema = new Schema({
  capacity: Number,
  alcohol: {
    allowed: Boolean,
    served: Boolean
  },
  layout: {},
  levy: Number,
  hourlyCharge: Number
}, { strict: false })

const advtSchema = new Schema({
  visibility: String,
  photo: [],
  text: String
}, { strict: false })

const restaurantBranchConfig = new Schema({
  foodItems: [foodItemSchema],
  seatArrangement: seatArrangementSchema,
  profile: sellerProfileSchema,
  order: [],
  courier: [],
  advertisement: [advtSchema]
}, { strict: false })

const sellerConfigSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  commonSettings: {
    restaurantName: String,
    logo: {},
  },
  branches: [restaurantBranchConfig]
}, { strict: false });

const sellerConfig = mongoose.model('Seller', sellerConfigSchema)
module.exports = sellerConfig;