const express = require('express');
const router = express.Router();
const env = require('dotenv').config();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/signup',async (req,res)=>{
    const {full_name,email,password, isAdmin} = req.body;
    let userToInsert = await User.findOne({email : req.body.email});
    if(userToInsert) return res.status(400).send('user already registered');

     userToInsert = new User({full_name,email,password, isAdmin}) ;
     const salt = await bcrypt.genSalt(10);
     userToInsert.password = await bcrypt.hash(userToInsert.password, salt);

    let status = 200;
    let data = {};

    try{
        
        const result = await User.insertMany([userToInsert]);
        data = result;
    }
    catch(error){

        status = 400;
        data = error;
    }
    const token = userToInsert.generateAuthToken();
    res.status(status).header('x-auth',token).json(_.pick(userToInsert, ['full_name', 'email']));
});

router.delete('/:id',auth,admin, async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
  
    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
  });

module.exports = router;