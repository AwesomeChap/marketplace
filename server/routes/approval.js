const express = require('express');
const router = express.Router();
const Approval = require('../db/models/approval');
const User = require('../db/models/user');
const dotenv = require('dotenv');
const result = dotenv.config();

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
          Approval.find({ userId: req.query.userId }).then((approvals) => {
            console.log(approvals);
            return res.status(200).json({ message: "Approvals fetched", approvals })
          }).catch(e => res.status(500).json({ message: "Some error occured while fetching approvals", errors: e }))
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
          Approval.findByIdAndRemove(approvalId).then((approval) => {
            return res.status(200).json({ message: "Suggestion withdrawn", approval })
          }).catch(e => res.status(500).json({ message: "Some error occured while fetching approvals", errors: e }))
        }
      }).catch(err => res.status(500).json({ message: "Some error occured while fetching data", errors: err }));
  }
})

//this would be only invoked by admin
// router.put('/', (req, res) => {
// change status of approval
// })


module.exports = router
