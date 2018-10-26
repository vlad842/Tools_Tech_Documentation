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
/*if(!process.env.SECRET_KEY){
    console.error('FATAL ERROR : jwtPrivateKey is not defined');
    process.exit(1);
}*/

app.set('port',process.env.PORT || 3000 );

//app.use(express.json());
//app.use(routes);
/*Fill in connection string
mongoose.connect('mongodb://localhost/tools_tech_doc_db',{useNewUrlParser:true})
    .then(()=>console.log('connected to mongo'))
    .catch(err=>console.error('couldnt connect to mongoDB',err));
mongoose.set('useCreateIndex', true);*/
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));