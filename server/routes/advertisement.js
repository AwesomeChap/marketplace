const express = require('express');
const router = express.Router();
const Advertisements = require('../db/models/advertisement');
const User = require('../db/models/user');
const Config = require('../db/models/config');
const dotenv = require('dotenv');
const result = dotenv.config();
const _ = require('lodash');




