const express = require('express');
const router = express.Router();
const SellerConfig = require('../db/models/seller');
const User = require('../db/models/user');
const dotenv = require('dotenv');
const result = dotenv.config();

router.get('/', (req, res) => {
  if (!req.query.userId) {
    res.status(400).json({ message: "Insufficient paramteres" })
  }
  else {
    const { userId } = req.query;
    SellerConfig.findOne({ _userId: userId }).then((config) => {
      if (!config) {
        res.status(200).json({ message: "config not initialzed", type: "info", config: {} });
      }
      else {
        res.status(200).json({ message: "Seller configuration loaded", config });
      }
    }).catch((e) => res.status(500).json({ message: "some error occured while fetching config", errors: e }));
  }
})

router.post('/', (req, res) => {
  if (!(req.body.userId || req.body.values || req.body.prop)) {
    res.status(400).json({ message: "Insufficient paramteres" })
  }
  else {
    const { userId, values, prop } = req.body;
    SellerConfig.findOne({ _userId: userId }).then((config) => {
      if (!config) {
        const newSellerConfig = new SellerConfig({
          _userId: userId,
          commonSettings: config.commonSettings,
          branches: [{ [prop]: values }]
        });
        newSellerConfig.save().then((config) => {
          if (config) {
            res.status(200).json({ message: `config saved`, config: config.branches[0] })
          }
        }).catch((e) => res.status(500).json({ message: 'Some error occured while saving seller config', errors: e }));
      }
      else {
        const { branchId } = req.body;
        console.log(req.body);
        if (!branchId) {
          res.status(400).json({ message: "Branch Id is required!" });
        }
        else {
          let branch = config.branches.id(branchId);
          SellerConfig.findOneAndUpdate({ "_userId": userId, "branches._id": branchId }, { [`branches.$.${prop}`]: values }, { new: true })
            .then((updatedConfig) => {
              if (updatedConfig) {
                res.status(200).json({ config: updatedConfig.branches.id(branchId)[prop], message: `${prop} config updated!` })
              }
            }).catch((e) => res.status(500).json({ message: `err updating ${prop} config`, errors: e }))
        }
      }
    })
  }
})

router.post('/commonSettings', (req, res) => {
  const { values, userId } = req.body;
  SellerConfig.findOne({ _userId: userId }).then((config) => {
    if (!config) {
      const newSellerConfig = new SellerConfig({
        _userId: userId,
        commonSettings: values,
        branches: []
      });
      newSellerConfig.save().then((config) => {
        if (config) {
          res.status(200).json({ message: `common settings saved`, config: config })
        }
      }).catch((e) => res.status(500).json({ message: 'Some error occured while saving seller config', errors: e }));
    }
    else {
      SellerConfig.findOneAndUpdate({ "_userId": userId }, { commonSettings: values })
        .then((updatedConfig) => {
          if (updatedConfig) {
            res.status(200).json({ config: updatedConfig, message: `common settings updated!` })
          }
        }).catch((e) => res.status(500).json({ message: `err updating config`, errors: e }))
    }
  })
})

router.post('/new', (req, res) => {
  if (!(req.body.userId)) {
    return res.status(400).json({ message: "Insufficient params" });
  }
  SellerConfig.findOne({ _userId: req.body.userId }).then((sellerConfig) => {
    if (!sellerConfig) {
      res.status(404).json({ message: "Config not found!" });
    }
    const newBranch = {
      foodItems: [],
      seatArrangement: {},
      profile: {},
      order: [],
      courier: [],
      advertisement: []
    }

    sellerConfig.branches.push(newBranch);
    sellerConfig.save().then(updatedConfig => {
      return res.status(200).json({ branch: updatedConfig.branches[updatedConfig.branches.length - 1] });
    }).catch(e => res.status(500).json({ message: "some error occured", errors: e }))

  }).catch(e => res.status(500).json({ message: "some error occured", errors: e }))
})

router.post('/foodItem', (req, res) => {
  if (!(req.body.userId || req.body.branchId || req.body.foodItem)) {
    return res.status(400).json({ message: "Insufficient params" });
  }
  const { userId, branchId, foodItem } = req.body;

  SellerConfig.findOne({ _userId: userId }).then(sellerConfig => {
    const branchIndex = sellerConfig.branches.map(obj => obj._id).indexOf(branchId);

    if (foodItem._id) {
      let foodItemIndex = sellerConfig.branches[branchIndex].foodItems.map(obj => obj._id).indexOf(foodItem._id);

      if (foodItemIndex !== -1) {
        sellerConfig.branches.id(branchId).foodItems[foodItemIndex] = foodItem;
      }
      else{
        delete foodItem._id;
        sellerConfig.branches.id(branchId).foodItems.push(foodItem);
      }
      sellerConfig.save().then((updatedConfig) => {
        if (updatedConfig) {
          foodItemIndex = updatedConfig.branches[branchIndex].foodItems.map(obj => obj.name).indexOf(foodItem.name);
          console.log(foodItemIndex);
          return res.status(200).json({ message: "Food item updated successfully", foodItem: updatedConfig.branches.id(branchId).foodItems[foodItemIndex] });
        }
      }).catch(e => res.status(500).json({ message: "Some error occured while updating food Item", errors: e }))
    }

    else {
      SellerConfig.findOne({ "_userId": userId }).then((sellerConfig) => {
        if (sellerConfig.branches.length) {
          sellerConfig.branches.id(branchId).foodItems.push(foodItem);

          sellerConfig.save().then((savedConfig) => {
            if (!!savedConfig) {
              return res.status(200).json({ message: "Food item added successfully", foodItem: savedConfig.branches.id(branchId).foodItems[savedConfig.branches.id(branchId).foodItems.length - 1] });
            }
          }).catch(e => res.status(500).json({ message: "Some error occured while saving food item", errors: e }))
        }
        else {
          return res.status(404).json({ message: "Seller config not found" });
        }
      }).catch(e => res.status(500).json({ message: "Some error occured while finding config for saving", errors: e }))
    }
  })

  // if (!!foodItem._id) {
  //   //update
  //   SellerConfig.findOne({ "_userId": userId }).then((sellerConfig) => {
  //     if (sellerConfig.branches.length) {

  //       const branchIndex = sellerConfig.branches.map(obj => obj._id).indexOf(branchId);
  //       const foodItemIndex = sellerConfig.branches[branchIndex].foodItems.map(obj => obj._id).indexOf(foodItem._id);

  //       sellerConfig.branches.id(branchId).foodItems[foodItemIndex] = foodItem;

  //       sellerConfig.save().then((updatedConfig) => {
  //         if (updatedConfig) {
  //           return res.status(200).json({ message: "Food item updated successfully", foodItem: updatedConfig.branches.id(branchId).foodItems[foodItemIndex] });
  //         }
  //       }).catch(e => res.status(500).json({ message: "Some error occured while updating food Item", errors: e }))
  //     }
  //     else {
  //       return res.status(404).json({ message: "Seller config not found" });
  //     }
  //   }).catch(e => res.status(500).json({ message: "Some error occured while finding config for updating", errors: e }))

  // }
  // else {
  //   //new item
  //   SellerConfig.findOne({ "_userId": userId }).then((sellerConfig) => {
  //     if (sellerConfig.branches.length) {
  //       sellerConfig.branches.id(branchId).foodItems.push(foodItem);

  //       sellerConfig.save().then((savedConfig) => {
  //         console.log(savedConfig.branches.id(branchId).foodItems);
  //         if (!!savedConfig) {
  //           return res.status(200).json({ message: "Food item added successfully", foodItem: savedConfig.branches.id(branchId).foodItems[savedConfig.branches.id(branchId).foodItems.length - 1] });
  //         }
  //       }).catch(e => res.status(500).json({ message: "Some error occured while saving food item", errors: e }))
  //     }
  //     else {
  //       return res.status(404).json({ message: "Seller config not found" });
  //     }
  //   }).catch(e => res.status(500).json({ message: "Some error occured while finding config for saving", errors: e }))
  // }
})

router.delete('/foodItem', (req, res) => {
  if (!(req.body.userId || req.body.branchId || req.body.foodItemId)) {
    return res.status(400).json({ message: "Insufficient paramteres" })
  }

  const { userId, branchId, foodItemId } = req.body;
  console.log(req.body);
  SellerConfig.findOne({ _userId: userId }).then((config) => {
    if (!config) {
      return res.status(404).json({ message: "Config not found!" });
    }
    console.log(foodItemId);
    config.branches.id(branchId).foodItems.id(foodItemId).remove();
    console.log(foodItemId);
    config.save().then(updatedConfig => {
      return res.status(200).json({ message: "foodItem removed successfuly!", config: updatedConfig });
    }).catch(e => res.status(500).json({ message: "Unable to remove config", errors: e }));
  }).catch(e => res.status(500).json({ message: "Unable to find config", errors: e }));
})

router.delete('/', (req, res) => {
  if (!(req.body.userId || req.body.branchId)) {
    res.status(400).json({ message: "Insufficient paramteres" })
  }
  else {
    const { userId, branchId } = req.body;
    SellerConfig.findOne({ _userId: userId }).then((config) => {
      if (!config) {
        return res.status(404).json({ message: "Config not found" });
      }

      else {
        // if (config.branches.length > 1) {
        config.branches.id(branchId).remove();
        config.save().then(updatedConfig => {
          return res.status(200).json({ message: "branch removed successfuly!", config: updatedConfig });
        }).catch(e => res.status(500).json({ message: "Unable to remove config", errors: e }));
        // }
        // else {
        //   SellerConfig.findOneAndDelete({ _userId: userId }).then((updatedConfig) => {
        //     if (updatedConfig) {
        //       return res.status(200).json({ message: "Seller profile removed successfuly!", config: {} });
        //     }
        //   }).catch(e => res.status(500).json({ message: "Unable to remove seller profile config", errors: e }));
        // }
      }
    })
  }
})

module.exports = router
