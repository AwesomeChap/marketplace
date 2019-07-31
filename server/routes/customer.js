const express = require('express');
const router = express.Router();
const Customer = require('../db/models/customer');
const User = require('../db/models/user');
const dotenv = require('dotenv');
const result = dotenv.config();

router.get('/', (req, res) => {
  if (!req.query.userId) {
    res.status(400).json({ message: "Insufficient parameters" });
  }
  else {
    User.findById(req.query.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found!" })
        }
        else {
          Customer.findOne({ userId: req.query._userId }).then((customerConfig) => {
            if (!customerConfig) {
              return res.status(200).json({ type: "info", message: "Config not initialized", config: {} });
            }
            else {
              if (req.query.prop) {
                if (customerConfig.hasOwnProperty(req.query.prop)) {
                  return res.status(200).json({ message: `${prop} config found!`, config: customerConfig[prop] });
                }
                else {
                  return res.status(200).json({ message: `${prop} config needs initialization` });
                }
              }
              else {
                return res.status(200).json({ message: "Config found", config: customerConfig })
              }
            }
          })
        }
      }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
  }
})

router.post('/', (req, res) => {
  if (!req.body.userId || !req.body.values || !req.body.prop) {
    res.status(400).json({ message: "Insufficient parameters" });
  }
  else {
    const { userId, values, prop } = req.body;
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found!" })
        }
        else {
          Customer.findOne({ _userId: userId }).then((customerConfig) => {
            if (!customerConfig) {
              //new config
              const newConfig = new Customer({[prop]: values, _userId: userId });
              newConfig.save().then((savedConfig) => {
                if (savedConfig) {
                  return res.status(200).json({ message: "Config saved successfully", config: savedConfig[prop] });
                }
              }).catch(e => { return res.status(500).json({ message: `Some error occured while saving customer's ${prop} details`, errors: e }) })

            }
            else {
              //old config
              Customer.findByIdAndUpdate(customerConfig._id, { [prop]: values }, { new: true })
                .then((updatedConfig) => {
                  if (updatedConfig) {
                    return res.status(200).json({ message: `${prop} config updated successfully`, config: updatedConfig[prop] });
                  }
                }).catch(e => res.status(500).json({ message: `Some error occured while updating customer's ${prop} details`, errors: e }))
            }
          })
        }
      }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
  }
})


module.exports = router
