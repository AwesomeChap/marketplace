const express = require('express');
const router = express.Router();
const SellerConfig = require('../db/models/seller');
const dotenv = require('dotenv');
const result = dotenv.config();

router.get('/', (req, res) => {
  if(!req.query.lat && !req.query.long){
    return res.status(500).json({message: "Insufficient paramaters"})
  }
  else{
    console.log(req.query.location);
  }
})

module.exports = router
