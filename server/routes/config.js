const express = require('express');
const router = express.Router();
const Config = require('../db/models/config');
const User = require('../db/models/user');
const dotenv = require('dotenv');
const result = dotenv.config();

router.get('/mail', (req, res) => {
  if (!req.query.userId) {
    res.status(400).json({ message: "Insufficient parameters" });
  }
  else {
    User.findById(req.query.userId)
      .then((user) => {
        if (!user) {
          return res.status(400).json({ message: "User not found!" })
        }
        else {
          if (user.type != 'admin') {
            return res.status(401).json({ message: "Unauthorized access" })
          }
          else {
            Config.findOne({ _userId: user._id })
              .then((config) => {
                if (config && config.mail) {
                  res.status(200).json({message : "Previous config found", config: config.mail})
                }
                else {
                  res.status(200).json({type: "info", message: "Config needs initialisation", config: {}})
                }
              })
              .catch(err =>
                res.status(500).json({ message: "Error occured while finding config", errors: err })
              )
          }
        }
      }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
  }
})

router.post('/mail', (req, res) => {
  // console.log(req.body);
  if (!req.body.userId || !req.body.values) {
    res.status(400).json({ message: "Insufficient parameters" });
  }
  else {
    User.findById(req.body.userId)
      .then((user) => {
        if (!user) {
          return res.status(400).json({ message: "User not found!" })
        }
        else {
          if (user.type != 'admin') {
            return res.status(401).json({ message: "Unauthorized access" })
          }
          else {
            Config.findOne({ _userId: user._id })
              .then((config) => {
                if (config) {
                  // update it
                  // console.log('came at right place')
                  // res.status(500).send({message: "test"});
                  // console.log(config);
                  Config.findByIdAndUpdate(config._id, { mail: req.body.values }, { new: true })
                    .then((updatedConfig) => {
                      if (updatedConfig) {
                        return res.status(200).json({ message: "Mail config updated successfully" });
                      }
                    }).catch(e => res.status(500).json({message: "error occured while updating schema", errors: e}))
                }
                else {
                  //create a new one
                  const newConfig = new Config({ mail: req.body.values, _userId: user._id });
                  newConfig.save().then((savedConfig) => {
                    if (savedConfig) {
                      return res.status(200).json({ message: "New Configuration created" });
                    }
                  }).catch(e => res.status(500).json({message: "error occured while creating config", errors: e}))
                }
              })
              .catch(e =>
                res.status(500).json({ message: "Error occured while finding config", errors: e })
              )
          }
        }
      }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
  }
});


module.exports = router
