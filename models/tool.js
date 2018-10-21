const mongoose = require('mongoose');
const {ChamberSchema} = require('./chamber');
const Joi = require('joi');

const Tool = mongoose.model('Tool', new mongoose.Schema({
    serialNumber:{
        type : String,
        required : true,
        unique : true,
        trim : true,
        minlength : 6,
        maxlength : 6
    },
    chambers:{
        type : [ChamberSchema],
        required : true,
    }

}));

function validateTool(tool){
    const schema = {
        serialNumber : Joi.string().length(6).required,
        chambers : Joi.object(ChamberSchema).array().minlength(4).maxlength(5).required(),
    } 
    return Joi.validate(tool,schema);
}
exports.Tool=Tool;
exports.validateTool=validateTool;

