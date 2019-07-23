const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const ingredientsSchema = new Schema({
  name: String,
  image: {},
  quantity: String
},{strict: false})

const sellerProfileSchema = new Schema({
  branchName: String,
  serviceOptions: [String], //dining in, take away, delivery
  logo: {},
  photos: [],
  address: String,
  cateringService: {
    available: Boolean,
    coverageArea: Number,
    quantityOfFoodPerMember: Number,
    modeOfService: [String] // food is delivered, service personnel, 
  }
},{strict: false})

const foodItemSchema = new Schema({
  name: String, 
  image: {},
  type: String, // veg or non-veg
  price: Number,
  leadTime: String,
  serveTime: [String],
  category: [String],
  flavours: [String],
  recipie: [String],
  ingredients: [ingredientsSchema],
  spiceLevel: String,
  allergies: [String],
  nutrition: {
    protein: [],
    vitamin: [],
    mineral: [],
    fats: [],
    sugar: []
  },
  promotion: {}
}, {strict: false})

const seatArrangementSchema = new Schema({
  capacity: Number,
  alcohol: {
    allowed: Boolean,
    served: Boolean
  },
  layout: {},
  levy: Number,
  hourlyCharge: Number
},{strict: false})

const advtSchema = new Schema({
  foodItemId: String,
  planDetails: {
    view: String,
    visibility: String,
  }
},{strict: false})

const restaurantBranchConfig = new Schema({
  foodItems: [foodItemSchema],
  seatArrangement:seatArrangementSchema,
  profile: sellerProfileSchema,
  order: [],
  courier: [],
  advertisement: [advtSchema]
},{strict: false})

const sellerConfigSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // mainBranchId: String,
  branches: [restaurantBranchConfig]
}, { strict: false });

const sellerConfig = mongoose.model('SellerConfig', sellerConfigSchema)
module.exports = sellerConfig;