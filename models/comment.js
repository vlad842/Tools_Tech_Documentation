const mongoose = require('mongoose');
const { UserSchema } = require('./user');
const {tag} = require('./tag');
const Joi = require('joi');

const Comment = mongoose.model('Comment', new mongoose.Schema({

    record_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        required :true
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    
    content: {
        type : String,
        required : true,
        minlength : 1,
        maxlength : 255
    },

    tag_ids: [{type:mongoose.Schema.Types.ObjectId, ref:'tag'}]
}));

function validateComment(comment){
    const schema = {
        //record_id: Joi.string().required(),
        //user_id: Joi.string().required(),
        //content : Joi.string().minlength(1).maxlength(255).required(),
    };
    return Joi.validate(comment,schema);
}

exports.Comment = Comment;
exports.validateComment = validateComment;