const express = require('express');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const router = express.Router();
const {User} = require('./../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/login',async(req,res)=>{
    const { email, password } = req.body;
    console.log(req.body);


    /*const is_first_time =  (await User.aggregate([{$project:{_id:1}}])).length === 0;
    if(is_first_time)
    {
        userToInsert = new User({full_name:"Admin",email,password, isAdmin:true}) ;
        const salt = await bcrypt.genSalt(10);
        userToInsert.password = await bcrypt.hash(userToInsert.password, salt);
        await User.insertMany([userToInsert]);
    }*/


    let user = await User.findOne({email :email});
    if(!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const validPassword =await bcrypt.compare(password , user.password);
    if(!validPassword) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = user.generateAuthToken();
    const isAdmin = user.isAdmin ? true : false;
    
    return res.status(200).json({token,isAdmin,});
});
module.exports = router;