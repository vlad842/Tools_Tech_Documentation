const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const {Tag, validateTag} = require('../models/tag');

router.get('/',auth, async (req,res)=>{
    let status = 200;
    let data = {};

    try {
        const allTags = await Tag.find();
        data = allTags;
    } catch (error) {
        data = error;
        status = 400;
    }
    res.status(status).json(data);

});

router.post('/add' ,auth, async(req,res)=>{
    const{error} = validateTag(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let tag = await Tag.findOne({name : req.body.name})
    if(tag) return res.status(400).json('Tag already exists');
   
    const {name, color} = req.body;
    let status = 200;
    let data = {};
      
    try {
        tagToInsert = new Tag({name, color});
        result = await tagToInsert.save();
        data = result;
    } catch (error) {
        data = error;
        status = 400;
    }

    res.status(status).json(data);

});

router.delete('/remove', (req,res)=>{

    //TODO:

});

module.exports = router;