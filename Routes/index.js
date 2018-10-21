const express = require('express');
const router = express.Router();
const Joi = require('joi');
//const Joi.objectID = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const chambers_router = require('./chambers');
const records_router = require('./records');
const roles_router = require('./roles');
const tools_router = require('./tools');
const users_router = require('./users');
const auth = require('./auth');

router.use('/chambers',chambers_router);
router.use('/records',records_router);
router.use('/roles',roles_router);
router.use('/tools',tools_router);
router.use('/users',users_router);
router.use('/auth', auth);
module.exports = router;