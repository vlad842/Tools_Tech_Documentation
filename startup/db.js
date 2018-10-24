const mongoose = require('mongoose');

module.exports = function (){
    mongoose.connect('mongodb://localhost/tools_tech_doc_db',{useNewUrlParser:true})
    .then(()=>console.log('connected to mongo'))
    .catch(err=>console.error('couldnt connect to mongoDB',err));
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
}