const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const User = require('./../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/',async(req,res)=>{
    let user = await User.findOne({email :req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword =await bcrypt.compare(req.body.password , user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({id: user.id},config.get('jwtPrivateKey'));
    res.send(token);
});
module.exports = router;