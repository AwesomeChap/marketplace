const express = require('express');
const router = express.Router();
const SellerConfig = require('../db/models/seller');
const Config = require('../db/models/config');
const dotenv = require('dotenv');
const result = dotenv.config();
const _ = require("lodash");

function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km (change this constant to get miles)
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  // if (d>1) return Math.round(d)+"km";
  // else if (d<=1) return Math.round(d*1000)+"m";
  return Math.round(d * 1000);
}

const convertTreeToArray = (array, tree) => {
  array.push(...tree.values);
  tree.values.forEach((val) => {
      return convertTreeToArray(array, tree[_.camelCase(val)]);
  })
  return array;
}

router.get('/options', (req, res) => {
  Config.find({}).then(configs => {
    let { categories } = configs[0];
    let allCategories = convertTreeToArray([], categories);
    allCategories.sort();
    res.status(200).json({ options: { categories : {main : configs[0].categories.values.sort(), all: allCategories} } });
  }).catch(e => res.status(500).json({ messsage: "some error occured while fetching restaurant filter options", errors: e }))
})

router.get('/', (req, res) => {
  if (!req.query.lat && !req.query.long) {
    return res.status(500).json({ message: "Insufficient paramaters" })
  }
  else {
    SellerConfig.find({}).then(sellers => {
      let slrs = sellers.map(seller => {
        const { restaurantName, logo } = seller.commonSettings;
        let logoUrl = logo[0].thumbUrl;
        return seller.branches.map(branch => {
          const { _id, alcohol, fullAddr, delivery, serviceOptions, minOrder, costForOne, openingTime, closingTime, closingDays, discount, discountMinOrder, discountTimeSpan, smokingAllowed, capacity, rating } = branch.profile;
          let foodType = [];
          let dishes = [];
          let categories = [];
          let flavours = [];
          let allergies = [];
          seller.foodItems.forEach(foodItem => {
            if (!!foodItem.branchSpecificDetails.find(el => el.branchName == branch.profile.branchName)) {
              foodType = [...foodType, foodItem.type];
              dishes = [...dishes, foodItem.name];
              categories = _.union(categories, foodItem.category);
              flavours = _.union(flavours, foodItem.flavours);
              allergies = _.union(allergies, foodItem.allergy);
            }
          })
          foodType = _.sortedUniq(foodType); dishes.sort(); categories.sort(); flavours.sort();
          return {
            restaurantName, logoUrl, _id, alcohol, serviceOptions, minOrder, costForOne, openingTime, fullAddr, delivery,
            closingTime, closingDays, discount, discountMinOrder, discountTimeSpan, smokingAllowed, capacity, foodType, dishes, categories, flavours, rating
          };
        })
      })
      slrs = [].concat.apply([], slrs);
      slrs = slrs.map(slr => {
        console.log(req.query.lat, req.query.long, slr.fullAddr.geometry.latitude, slr.fullAddr.geometry.longitude);
        slr["distance"] = distance(req.query.lat, req.query.long, slr.fullAddr.geometry.latitude, slr.fullAddr.geometry.longitude)
        return slr;
      })
      slrs.sort((a, b) => a.distance - b.distance);
      res.status(200).json({ restaurants: slrs });
    }).catch(e => res.status(500).json({ message: "some error occured while fetching the restaurants" }))
  }
})

module.exports = router

// every thing is per branch

/*
restaurantName
Logo

serviceOptions             x
minOrder // sort           
cost for one               
openingHours               
closingDays                x
alcohol                    x
discount // sort          
smoking allowed
capacity
rating

pure veg // to be created
dishes // to be created
categories //to be created
flavours // to be created
*/
