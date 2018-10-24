const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

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
    isAdmin: Boolean
});

UserSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({id: this._id, isAdmin: this.isAdmin},process.env.SECRET_KEY);
    return token;
}

const User =  mongoose.model('User',UserSchema);
module.exports = User;