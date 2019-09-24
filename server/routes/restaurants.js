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
    res.status(200).json({ options: { categories: { main: configs[0].categories.values.sort(), all: allCategories } } });
  }).catch(e => res.status(500).json({ messsage: "some error occured while fetching restaurant filter options", errors: e }))
})

router.get('/online/:sellerId/:branchId', (req, res) => {
  const { sellerId, branchId } = req.params;
  SellerConfig.findById(sellerId).then(seller => {
    console.log(seller);
    try {
      const { restaurantName, logo } = seller.commonSettings;
      const logoUrl = logo[0].thumbUrl;
      let profile = seller.branches.id(branchId).profile;
      const { foodItems } = seller;
      let mainCategories = [];
      let foodType = [];
      let dishes = [];
      let ingredients = [];
      let nutrients = [];
      let categories = { main: [], all: [] };
      let flavours = [];
      let allergies = [];
      let spiceLevels = [];

      foodItems.forEach(foodItem => {
        if (!!foodItem.branchSpecificDetails.find(el => el.branchName == profile.branchName)) {
          foodType = [...foodType, foodItem.type];
          dishes = [...dishes, foodItem];
          categories.all = _.union(categories.all, foodItem.category);
          flavours = _.union(flavours, foodItem.flavours);
          spiceLevels = _.union(spiceLevels, foodItem.spiceLevel);
          allergies = _.union(allergies, foodItem.allergy);
          ingredients = _.union(ingredients, foodItem.ingredients.map(ings => ings.name));
          nutrients = _.union(nutrients, foodItem.nutrition.map(nuts => nuts.name));
        }
      })

      foodType = _.sortedUniq(foodType); dishes.sort(); categories.all.sort(); flavours.sort();

      Config.find({}).then(configs => {
        mainCategories = configs[0].categories.values;
        categories.main = _.intersection(categories.all, mainCategories);
        categories.main.sort();

        res.status(200).json({ restaurantName, logoUrl, profile, foodType, dishes, categories, flavours, spiceLevels, allergies, ingredients, nutrients });

      }).catch(e => res.status(500).json({ messsage: "some error occured while fetching restaurant filter options", errors: e }))


    }
    catch (e) {
      res.status(400).json({ errors: e, message: "Branch Id incorrect" });
    }

  })
})

router.get('/booking/:sellerId/:branchId', (req, res) => {
  const { sellerId, branchId } = req.params;
  res.status(200).json({ message: "Booking option selected" });
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
        let rst_id = seller._id;
        return seller.branches.map(branch => {
          const { alcohol, fullAddr, delivery, serviceOptions, minOrder, costForOne, openingTime, closingTime, closingDays, discount, discountMinOrder, discountTimeSpan, smokingAllowed, capacity, rating } = branch.profile;
          let foodType = [];
          let dishes = [];
          let ingredients = [];
          let nutrients = [];
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
              ingredients = _.union(ingredients, foodItem.ingredients.map(ings => ings.name));
              nutrients = _.union(nutrients, foodItem.nutrition.map(nuts => nuts.name));
            }
          })

          foodType = _.sortedUniq(foodType); dishes.sort(); categories.sort(); flavours.sort();
          return {
            restaurantName, logoUrl, _id : branch._id, rst_id, alcohol, serviceOptions, minOrder, costForOne, openingTime, fullAddr, delivery, ingredients, nutrients,
            closingTime, closingDays, discount, discountMinOrder, discountTimeSpan, smokingAllowed, capacity, foodType, dishes, categories, flavours, rating
          };
        })
      })
      slrs = [].concat.apply([], slrs);
      slrs = slrs.map(slr => {
        // console.log(req.query.lat, req.query.long, slr.fullAddr.geometry.latitude, slr.fullAddr.geometry.longitude);
        slr["distance"] = distance(req.query.lat, req.query.long, slr.fullAddr.geometry.latitude, slr.fullAddr.geometry.longitude)
        return slr;
      })
      slrs.sort((a, b) => a.distance - b.distance);
      res.status(200).json({ restaurants: slrs });
    }).catch(e => res.status(500).json({ message: "some error occured while fetching the restaurants" }))
  }
})

router.get("*", (req, res) => {
  return res.send("Page not found")
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
