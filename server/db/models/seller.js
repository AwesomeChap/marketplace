const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Float = require('mongoose-float').loadType(mongoose);

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
  discount: Number,
  discountMinOrder: {type: Number, default: 0},
  discountTimeSpan: [String],
  openingTime: String,
  closingTime: String,
  closingDays: [String],
  contact: {
    email: String,
    phoneNumbers: [String],
  },
  costForOne: Float,
  minOrder: Float,
  delivery: {
    coverageArea: Float,
    cost: Float
  },
  address: String,
  fullAddr: {},
  cateringService: {
    available: { type: Boolean, default: false },
    coverageArea: Float,
    quantityOfFoodPerMember: Float,
    modeOfService: [String] // food is delivered, service personnel, 
  },
  capacity: { type: Float, default: 0 },
  alcohol: {
    allowed: { type: Boolean, default: false },
    served: { type: Boolean, default: false }
  },
  smokingAllowed: { type: Boolean, default: false },
  levy: { type: Float, default: 0 },
  hourlyCharge: { type: Float, default: 0 },
  rating: { type: Float, default: 0 }
}, { strict: false })

const foodItemsBranchSpecificDetailsSchema = new Schema({
  branchName: String,
  price: Float,
  discount: Number,
  discountTimeSpan: [String],
}, { strict: false });

const foodItemSchema = new Schema({
  name: String,
  image: [],
  type: String, // veg or non-veg
  leadTime: String,
  serveTime: [String],
  category: [String],
  flavours: [String],
  recipe: [String],
  ingredients: [ingredientsSchema],
  branchSpecificDetails: [foodItemsBranchSpecificDetailsSchema],
  spiceLevel: [String],
  allergies: [String],
  nutrition: [nutritionSchema],
}, { strict: false })

const layoutSchema = new Schema({
  name: String,
  type: String,
  key: String,
  seatCount: { type: Float, default: 2 },
  x: { type: Float, default: 0 },
  y: { type: Float, default: 0 },
  height: Float,
  width: Float,
})

const seatArrangementSchema = new Schema({
  layout: [layoutSchema],
  dimensions: {
    width: { type: Float, default: 0 },
    height: { type: Float, default: 0 }
  }
}, { strict: false })

const advtSchema = new Schema({
  visibility: String,
  photo: [],
  text: String
}, { strict: false })

const restaurantBranchConfig = new Schema({
  seatArrangement: seatArrangementSchema,
  profile: sellerProfileSchema,
  order: [],
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
  foodItems: [foodItemSchema],
  branches: [restaurantBranchConfig]
}, { strict: false });

const sellerConfig = mongoose.model('Seller', sellerConfigSchema)
module.exports = sellerConfig;