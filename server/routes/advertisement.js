const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Advertisements, AdvtStatusToken } = require('../db/models/advertisement');
const User = require('../db/models/user');
const Config = require('../db/models/config');
const dotenv = require('dotenv');
const result = dotenv.config();
const _ = require('lodash');


//save values and generate a token
router.post('/', (req, res) => {
    if (!req.body.userId || !req.body.values) {
        return res.status(200).json({ message: "Insufficient parameters" });
    }
    else {
        const { userId, values } = req.body;
        User.findById(userId).then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            else {
                new Advertisements({ ...values, status: "active" }).save().then(advt => {
                    if (!!advt) {
                        new AdvtStatusToken({advtId: advt._id, token: crypto.randomBytes(16).toString('hex'), createdAt: {}})
                        return res.status(200).json({ message: "Advetisement Saved", advt })
                    }
                })
            }
        })
    }
})




