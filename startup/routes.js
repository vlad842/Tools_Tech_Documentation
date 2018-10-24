const express = require('express');
const error = require('../middleware/error');
const router = express.Router();
const chambers_router = require('../routes/chambers');
const records_router = require('../routes/records');
const tools_router = require('../routes/tools');
const users_router = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app){
    app.use(express.json());
    app.use('/chambers',chambers_router);
    app.use('/records',records_router);
    app.use('/tools',tools_router);
    app.use('/users',users_router);
    app.use('/auth', auth);
    app.use(error);
}