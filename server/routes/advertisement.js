const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Advertisement, AdvtStatusToken1, AdvtStatusToken2, AdvtStatusToken3, AdvtStatusToken6, AdvtStatusToken12 } = require('../db/models/advertisement');
const User = require('../db/models/user');
const Config = require('../db/models/config');
const dotenv = require('dotenv');
const result = dotenv.config();
const _ = require('lodash');

router.get('/', (req, res) => {
    if (!req.query.userId) {
        return res.status(400).json({ message: "Insuffecient paramaters" });
    }
    else {
        console.log(req.query.userId);
        User.findById(req.query.userId).then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            if (user.type === "admin") {
                Advertisement.find({}).then(advts => {
                    return res.status(200).json({ message: "Advertisements fetched", advts })
                }).catch(e => res.status(500).json({ message: "Some error occured while fetching advts data", errors: e }));
            }
            else {
                Advertisement.findOne({ _userId: req.query.userId }).then(advt => {
                    if (!advt) {
                        return res.status(404).json({ message: "Advertisement not found" });
                    }
                    switch (advt.duration.key) {
                        case 1: AdvtStatusToken1.findOne({ _advtId: advt._id }).then(advtToken => {
                            if (!advtToken) {
                                Advertisement.findByIdAndUpdate(advt._id, { status: "end" }, { new: true }).then(advt => res.status(200).json({ message: "You plan has ended", advt })).catch(e => res.status(500).json({ message: "Error occured while setting status to end", errors: e }))
                            }
                            return res.status(200).json({ message: "Advertisement found", advt })
                        }); break;
                        case 2: AdvtStatusToken2.findOne({ _advtId: advt._id }).then(advtToken => {
                            if (!advtToken) {
                                Advertisement.findByIdAndUpdate(advt._id, { status: "end" }, { new: true }).then(advt => res.status(200).json({ message: "You plan has ended", advt })).catch(e => res.status(500).json({ message: "Error occured while setting status to end", errors: e }))
                            }
                            return res.status(200).json({ message: "Advertisement found", advt })
                        }); break;
                        case 3: AdvtStatusToken3.findOne({ _advtId: advt._id }).then(advtToken => {
                            if (!advtToken) {
                                Advertisement.findByIdAndUpdate(advt._id, { status: "end" }, { new: true }).then(advt => res.status(200).json({ message: "You plan has ended", advt })).catch(e => res.status(500).json({ message: "Error occured while setting status to end", errors: e }))
                            }
                            return res.status(200).json({ message: "Advertisement found", advt })
                        }); break;
                        case 6: AdvtStatusToken6.findOne({ _advtId: advt._id }).then(advtToken => {
                            if (!advtToken) {
                                Advertisement.findByIdAndUpdate(advt._id, { status: "end" }, { new: true }).then(advt => res.status(200).json({ message: "You plan has ended", advt })).catch(e => res.status(500).json({ message: "Error occured while setting status to end", errors: e }))
                            }
                            return res.status(200).json({ message: "Advertisement found", advt })
                        }); break;
                        case 12: AdvtStatusToken12.findOne({ _advtId: advt._id }).then(advtToken => {
                            if (!advtToken) {
                                Advertisement.findByIdAndUpdate(advt._id, { status: "end" }, { new: true }).then(advt => res.status(200).json({ message: "You plan has ended", advt })).catch(e => res.status(500).json({ message: "Error occured while setting status to end", errors: e }))
                            }
                            return res.status(200).json({ message: "Advertisement found", advt })
                        }); break;
                        default: case 1: AdvtStatusToken1.findOne({ _advtId: advt._id }).then(advtToken => {
                            if (!advtToken) {
                                Advertisement.findByIdAndUpdate(advt._id, { status: "end" }, { new: true }).then(advt => res.status(200).json({ message: "You plan has ended", advt })).catch(e => res.status(500).json({ message: "Error occured while setting status to end", errors: e }))
                            }
                            return res.status(200).json({ message: "Advertisement found", advt })
                        }); break;
                    }
                }).catch(e => res.status(500).json({ message: "Error occured while finding advertisement", errors: e }))
            }
        }).catch(e => res.status(500).json({ message: "Error occured while finding user", errors: e }))
    }
})

//save values and generate a token
router.post('/', (req, res) => {
    if (!req.body.userId || !req.body.values) {
        return res.status(400).json({ message: "Insufficient parameters" });
    }
    else {
        const { userId, values } = req.body;
        User.findById(userId).then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            else {
                if (values._id) {
                    Advertisement.findByIdAndUpdate(values._id, { photos: values.photos }, { new: true }).then(advt => {
                        if (!advt) {
                            return res.status(500).json({ message: "unable to update advt" });
                        }
                        else {
                            return res.status(200).json({ message: "Photos updated successfully", advt })
                        }
                    }).catch(e => res.status(500).json({ message: "some error occured while updating photos advt" }));
                }
                else {
                    new Advertisement({ _userId: userId, ...values, status: "active" }).save().then(advt => {
                        if (!!advt) {
                            switch (values.duration.key) {
                                case 1: new AdvtStatusToken1({ _advtId: advt._id, token: crypto.randomBytes(16).toString('hex') }).save(err => {
                                    if (err) return res.status(404).json({ errors: err });
                                    return res.status(200).json({ message: "Advertisement Saved", advt })
                                }); break;
                                case 2: new AdvtStatusToken2({ _advtId: advt._id, token: crypto.randomBytes(16).toString('hex') }).save(err => {
                                    if (err) return res.status(404).json({ errors: err });
                                    return res.status(200).json({ message: "Advertisement Saved", advt })
                                }); break;
                                case 3: new AdvtStatusToken3({ _advtId: advt._id, token: crypto.randomBytes(16).toString('hex') }).save(err => {
                                    if (err) return res.status(404).json({ errors: err });
                                    return res.status(200).json({ message: "Advertisement Saved", advt })
                                }); break;
                                case 6: new AdvtStatusToken6({ _advtId: advt._id, token: crypto.randomBytes(16).toString('hex') }).save(err => {
                                    if (err) return res.status(404).json({ errors: err });
                                    return res.status(200).json({ message: "Advertisement Saved", advt })
                                }); break;
                                case 12: new AdvtStatusToken12({ _advtId: advt._id, token: crypto.randomBytes(16).toString('hex') }).save(err => {
                                    if (err) return res.status(404).json({ errors: err });
                                    return res.status(200).json({ message: "Advertisement Saved", advt })
                                }); break;
                                default: case 1: new AdvtStatusToken1({ _advtId: advt._id, token: crypto.randomBytes(16).toString('hex') }).save(err => {
                                    if (err) return res.status(404).json({ errors: err });
                                    return res.status(200).json({ message: "Advertisement Saved", advt })
                                }); break;
                            }
                        }
                    })
                }
            }
        })
    }
})

router.delete('/', (req, res) => {
    if (!req.body.advtId) {
        return res.status(400).json({ message: "Insuffecient paramaters" });
    }
    else {
        Advertisement.findByIdAndDelete(req.body.advtId).then(advt => {
            console.log(advt.duration.key, advt._id, req.body.advtId);
            if (!advt) {
                return res.status(404).json({ message: "Advertisement not found" });
            }
            switch (advt.duration.key) {
                case 1: AdvtStatusToken1.findOneAndDelete({ _advtId: advt._id }).then(advtToken => {
                    if (advtToken) {
                        return res.status(200).json({ message: "Advertisement plan terminated" });
                    }
                }).catch(e => res.status(500).json({ errors: e })); break;
                case 2: AdvtStatusToken2.findOneAndDelete({ _advtId: advt._id }).then(advtToken => {
                    if (advtToken) {
                        return res.status(200).json({ message: "Advertisement plan terminated" });
                    }
                }).catch(e => res.status(500).json({ errors: e })); break;
                case 3: AdvtStatusToken3.findOneAndDelete({ _advtId: advt._id }).then(advtToken => {
                    if (advtToken) {
                        return res.status(200).json({ message: "Advertisement plan terminated" });
                    }
                }).catch(e => res.status(500).json({ errors: e })); break;
                case 6: AdvtStatusToken6.findOneAndDelete({ _advtId: advt._id }).then(advtToken => {
                    if (advtToken) {
                        return res.status(200).json({ message: "Advertisement plan terminated" });
                    }
                }).catch(e => res.status(500).json({ errors: e })); break;
                case 12: AdvtStatusToken12.findOneAndDelete({ _advtId: advt._id }).then(advtToken => {
                    if (advtToken) {
                        return res.status(200).json({ message: "Advertisement plan terminated" });
                    }
                }).catch(e => res.status(500).json({ errors: e })); break;
                default: case 1: AdvtStatusTokenAndDelete1.findOne({ _advtId: advt._id }).then(advtToken => {
                    if (advtToken) {
                        return res.status(200).json({ message: "Advertisement plan terminated" });
                    }
                }).catch(e => res.status(500).json({ errors: e })); break;
            }
        }).catch(e => res.status(500).json({ message: "Error occured while finding advertisement", errors: e }))
    }
})

module.exports = router;




