const mongoose = require('mongoose');
const {UserSchema} = require('./user');
const {ToolSchema} = require('./tool');
const {ChamberSchema} = require('./chamber');
const Joi = require('joi');

const Record= mongoose.model('Record',new mongoose.Schema({
    
   tool_id: {
        type: mongoose.Schema.Types.ObjectId,
        required : true
   },

   chamber_Num :{
        type : Number,
   },

   chamber_kind: {
        type : String ,
        enum : ['RTC','RC','TI','PLY','BE']
   },

   user_id : {
       type : mongoose.Schema.Types.ObjectId,
       required : true
   },

    date: {
         type : Date,
         required : true,
         default: Date.now
    },

    description: {
        type: String,
        required : true,
        minlength: 0,
        maxlength: 255
    },

    status: {
        type: String, 
        enum :['failure', 'scheduled maintenance', 'fixed' ,'in progress']
    }
}));

function validateRecord(record){
    const schema = {
        tool_id : Joi.string().required(),
        chamber_Num : Joi.number().min(1).max(5),
        chamber_kind : Joi.string().valid(['RTC','RC','TI','PLY','BE']),
        status :Joi.String().valid(['failure', 'scheduled maintenance', 'fixed' ,'in progress']).required()
    };
    return Joi.validate(record,schema);
}

exports.Record=Record;
