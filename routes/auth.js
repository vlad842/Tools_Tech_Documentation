const express = require('express');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const router = express.Router();
const User = require('./../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/login',async(req,res)=>{
    const { email, password } = req.body;
    console.log(req.body);
    let user = await User.findOne({email :email});
    if(!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const validPassword =await bcrypt.compare(password , user.password);
    if(!validPassword) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = user.generateAuthToken();
    return res.status(200).json({token});
});
module.exports = router;