const express = require('express');
const router = express.Router();
const Config = require('../db/models/config');
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
          return res.status(400).json({ message: "User not found!" })
        }
        else {
          if (user.type != 'admin') {
            return res.status(403).json({ message: "Access forbidden" })
          }
          else {
            Config.findOne({ _userId: user._id })
              .then((config) => {
                if (!req.query.prop) {
                  if (config) {
                    return res.status(200).json({ message: "Config found", config });
                  }
                  else {
                    return res.status(200).json({ type: "info", message: "Config is empty", config: {} })
                  }
                }
                else {
                  const { prop } = req.query;
                  if (config && config[prop]) {

                    res.status(200).json({ message: `${prop} config found`, config: config[prop] })
                  }
                  else {
                    res.status(200).json({ type: "info", message: `${prop} config requires initialisation`, config: {} })
                  }
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

router.post('/', (req, res) => {
  if (!req.body.userId || !req.body.values || !req.body.prop) {
    res.status(400).json({ message: "Insufficient parameters" });
  }
  else {
    const { userId, values, prop } = req.body;
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(400).json({ message: "User not found!" })
        }
        else {
          if (user.type != 'admin') {
            return res.status(403).json({ message: "Access forbidden" })
          }
          else {
            Config.findOne({ _userId: user._id })
              .then((config) => {
                if (config) {
                  // update it
                  Config.findByIdAndUpdate(config._id, { [prop]: values }, { new: true })
                    .then((updatedConfig) => {
                      if (updatedConfig) {
                        return res.status(200).json({ message: `${prop} config updated successfully`, config: updatedConfig[prop]});
                      }
                    }).catch(e => res.status(500).json({ message: "error occured while updating schema", errors: e }))
                }
                else {
                  //create a new one
                  const newConfig = new Config({ [prop]: values, _userId: user._id });
                  newConfig.save().then((savedConfig) => {
                    if (savedConfig) {
                      return res.status(200).json({ message: `New ${prop} Configuration created`, config: savedConfig[prop] });
                    }
                  }).catch(e => res.status(500).json({ message: "error occured while creating config", errors: e }))
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
