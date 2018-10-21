const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/signup',async (req,res)=>{
    const {full_name,email,password} = req.body;
    let userToInsert = await User.findOne({email : req.body.email});
    if(userToInsert) return res.status(400).send('user already registered');

     userToInsert = new User({full_name,email,password}) ;
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

    res.status(status).json(_.pick(userToInsert, ['full_name', 'email']));
});

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
  
    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
  });

module.exports = router;