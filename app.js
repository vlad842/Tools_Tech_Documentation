const express=require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const winston = require('winston');
const cors = require('cors');
const app= express();

app.use(cors());
require('./startup/db')();
require('./startup/config');
require('./startup/logging');
require('./startup/routes')(app);
require('./startup/prod')(app);

app.set('port',process.env.PORT || 3000 );

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
module.exports = server;