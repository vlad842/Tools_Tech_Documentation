const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const {Tag, validateTag} = require('../models/tag');
const {Record} = require('../models/record');
const {Comment} = require('../models/comment');

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

router.get('/:ids',async (req,res)=>{
  //  const params = [req.params.ids].concat(req.params[0].split('/').slice(1));
   try {
    let tags = await Tag.find({'_id' :{$is: req.params}});
   } catch (error) {
       res.status(400).send('tags were not found');
   } 
   res.status(200).json(tags);
    
})

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

router.delete('/remove/:id', async (req,res)=>{
    //if(!result) res.status(404).json('can not find tag');
    let data = {};
    let comments = {};

   try {
    const result = await Tag.findByIdAndRemove(req.params.id);
    const recordsWithTag = await Record.find({tags: req.params.id});
    const commentsWithTag = await Comment.find({tags: req.params.id});
    comments = commentsWithTag;
    data = recordsWithTag;

    //after removing the tag from its own collection, we need to delete it from all the records and comments
    for(let i =0; i<data.length; i++){
        Record.findByIdAndUpdate(
            { _id: data[i].id } , 
            { $pullAll : {tags:[req.params.id] } },
            {new :true},
            function(err,data){} );
        }

   } catch (error) {
       data = error
       res.status(400).send(data);
   }
    res.send(Record.collection.tags);

});

module.exports = router;