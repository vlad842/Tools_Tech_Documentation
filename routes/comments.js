const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {Tool} =require('../models/tool');
const {Comment, validateComment} = require('../models/comment');
const {User} = require('../models/user')
const {Tag} = require('../models/tag');
const {Record,validateRecord} = require('../models/record');
const mongoose = require('mongoose');

router.post('/addComment',auth, async (req,res)=>{
    // when posting a comment , we first find the relevant record and user and then 
    //we push the comment to the 'comments' collection in the record
    //TODO: req validation
    status = 200;
    data = {};
    const {record_id, content, tag_ids} = req.body;
    let user_id = req.user.id;


    try {
       let record = await Record.findById(record_id);
       const tags = await Tag.find({_id: {$all : tag_ids} });
       commentToInsert = new Comment({record_id, user_id, content, tags});
      
       if(tag_ids.length){
        commentToInsert.tag_ids.push(tag_ids);
        record.tags.addToSet(tag_ids);

       }
            
       const result = await commentToInsert.save();
       record.comments.push(commentToInsert);
       const updatedRecord = await record.save();
       data = {result, updatedRecord};

    } catch (error) {
        status = 400;
        data = {error};
    }
    
    res.status(status).json(data);

});

module.exports = router;