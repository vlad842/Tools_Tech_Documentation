const mongoose = require('mongoose');
const Joi = require('joi');
const validator = require('validator');

const Tag = mongoose.model('Tag', new mongoose.Schema({

    name : {
        type : String,
        required : true
    },

    color : {
        type: String,
        default : '#FFFFFF',
        validate : (value) =>{
            return validator.isHexColor}
    }

}),'tag');

function validateTag(tag){
    const schema = {
        name : Joi.string().required()
    };
    return Joi.validate(tag,schema);
}

exports.Tag=Tag;
exports.validateTag = validateTag;
