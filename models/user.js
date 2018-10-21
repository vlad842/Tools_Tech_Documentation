const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema=new mongoose.Schema({
    full_name:{
        type : String,
        required : true,
        minlength : 3,
        maxlength :255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value);
        }
    },
    password: {
        type : String,
        required : true,
        minlength : 5,
        maxlength :1024
    },
});

module.exports = mongoose.model('User',UserSchema);