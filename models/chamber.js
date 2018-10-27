const mongoose = require('mongoose');
const Joi = require('joi');
const ChamberSchema=new mongoose.Schema({
    serialNumber: {
         type: Number,
         required: true,
         min: 1, 
         max: 5
    },
    kind : {
        type: String,
        required : true,
        enum:['RCT','RC','TI','PLY','BE']
    }
});

const Chamber = mongoose.model('Chamber',ChamberSchema);

function validateChamber(chamber){
    const schema = {
        serialNumber : joi.Number().min(1).max(5).required(),
        kind : joi.string().required().maxlength(3).minlength(2)
    };
    return Joi.validate(chamber , schema);
}

exports.Chamber=Chamber;
exports.ChamberSchema = ChamberSchema;
exports.validate=validateChamber;