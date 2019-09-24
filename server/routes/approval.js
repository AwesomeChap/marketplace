const express = require('express');
const router = express.Router();
const Approval = require('../db/models/approval');
const User = require('../db/models/user');
const Config = require('../db/models/config');
const dotenv = require('dotenv');
const result = dotenv.config();
const _ = require('lodash');

//{userId, value}

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
          if (user.type === "admin") {
            if (!req.query.prop) {
              return res.status(400).json({ message: "Prop is required" });
            }
            else {
              
              Approval.find({ option: _.startCase(req.query.prop) }).then((approvals) => {
                return res.status(200).json({ message: "Approvals fetched", approvals })
              }).catch(e => res.status(500).json({ message: "Some error occured while fetching approvals", errors: e }))
            }
          }
          else {
            Approval.find({ userId: req.query.userId }).then((approvals) => {
              return res.status(200).json({ message: "Approvals fetched", approvals })
            }).catch(e => res.status(500).json({ message: "Some error occured while fetching approvals", errors: e }))
          }
        }
      }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
  }
})

router.post('/', (req, res) => {
  if (!req.body.value) {
    res.status(400).json({ message: "Insufficient parameters" });
  }
  else {
    const { value } = req.body;
    const { userId } = value;
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found!" })
        }
        else {
          new Approval(value).save().then((savedApproval) => {
            if (savedApproval) {
              return res.status(200).json({ message: "Suggestion Saved", approval: savedApproval })
            }
          }).catch((e) => res.status(500).json({ message: "Some error occured while saving approval", errors: e }))
        }
      }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
  }
})

// this would be invoked only by user
router.delete('/', (req, res) => {
  if (!req.body.userId || !req.body.approvalId) {
    res.status(400).json({ message: "Insufficient parameters" });
  }
  else {
    const { userId, approvalId } = req.body;
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found!" })
        }
        else {
          Approval.findById(approvalId).then((approval) => {
            if (approval.status.toLowerCase() === "approved") {
              return res.status(400).json({ message: "Approved changes cannot be removed" });
            }
            else {
              Approval.findByIdAndRemove(approvalId).then((approval) => {
                return res.status(200).json({ message: "Suggestion withdrawn", approval })
              }).catch(e => res.status(500).json({ message: "Some error occured while fetching approvals", errors: e }))
            }
          })
        }
      }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
  }
})

const updateCategoriesConfig = (obj, nh, subCategory, i) => {
  if (i < nh.length) {
    updateCategoriesConfig(obj[nh[i]], nh, subCategory, i + 1);
  }
  if (i == nh.length) {
    obj.values = [...obj.values, subCategory];
    obj[_.camelCase(subCategory)] = { values: [], approval: [] };
  }
}

// this would be only invoked by admin
router.put('/', (req, res) => {
  if (!req.body.value || !req.body.userId) {
    res.status(400).json({ message: "Insufficient parameters" });
  }
  else {
    const { value, userId } = req.body;
    const { status, option, data } = value
    const approvalId = value._id;

    Config.findOne({ _userId: userId }).then((config) => {

      if (status.toLowerCase() === "approved") {
        let prop;
        if (option == "Serve Time") {
          prop = "time"
        } else if (option == "Spice Level") {
          prop = "spices"
        }
        else {
          prop = _.camelCase(option);
        }

        let cloneConfig = { ...config };

        if (prop === "categories") {
          const nh = [...data.values.map(val => _.camelCase(val))];
          const obj = { ...config.categories };

          updateCategoriesConfig(obj, nh, data.subCategory, 0);
          cloneConfig[prop] = obj;
        }
        else {
          const newValue = { ...value.data, key: value.key };
          const obj = {...config[prop]}; 
          obj.values = [...config[prop].values, newValue];
          delete obj.$init;
          cloneConfig[prop] = obj;
        }

        console.log(prop, cloneConfig[prop]);

        Config.findByIdAndUpdate(config.id, { [prop]: cloneConfig[prop] }).then((updatedConfig) => {
          if (updatedConfig) {
            Approval.findByIdAndUpdate(approvalId, { status: status }, { new: true }).then((updatedApproval) => {
              if (updatedApproval) {
                return res.status(200).json({ message: "Approval status updated successfully", approval: updatedApproval, config: updatedConfig[prop] })
              }
            }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
          }
          else {
            return res.status(500).json({ message: "unable to update config" });
          }
        })
      }
      else {
        if (status.toLowerCase() !== "rejected") {
          return res.status(400).json({ message: "Invalid option" });
        }
        Approval.findByIdAndUpdate(approvalId, { status: status }, { new: true }).then((updatedApproval) => {
          if (updatedApproval) {
            return res.status(200).json({ message: "Approval status updated successfully", approval: updatedApproval })
          }
        }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
      }
    }).catch(err => res.status(500).json({ message: "Some error occured while finding config", errors: err }));
  }
})

router.get("*", (req, res) => {
  return res.send("Page not found")
})

module.exports = router
