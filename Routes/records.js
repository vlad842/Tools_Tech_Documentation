const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {Tool} =require('../models/tool');
const {Chamber} = require('../models/chamber');
const {User} = require('../models/user')
const {Record} = require('../models/record');
const mongoose = require('mongoose');

router.get('/',async (req,res)=>{
    const records = await Record.find().sort('-date');
    res.send(records);
})

router.post('/addRecord',auth, async (req,res) => {
const {tool_id, chamber_Num, user_id, description, status} = req.body;
let res_status= 200;
let data = {};

try {
    const recordToInsert = new Record({tool_id, chamber_Num, user_id, description, status});
    const result = await recordToInsert.save();
    data= result;
    
} catch (error) {
    res_status= 400;
    data = error;
}
res.status(res_status).json(data);
});

router.get('/:toolId', async (req,res)=>{
        const tool = await Tool.findById(req.params.toolId);
        if(!tool) return res.status(404).send('tool number is not valid');
        
        const record = await Record.find({tool_id : tool._id});
        if(record.length===0) res.json('no records were found');
        res.status(200).json(record);
})

router.get('/:toolId/:chamber', async (req, res) => {
    try {
        ///find the given tool and chamber
        const tool = await Tool.findById(req.params.toolId);
        if(!tool) return res.status(404).send('tool number is not valid');
        const chamber = tool.chambers[req.params.chamber - 1];

        //find if a record exists for given tool and chamber
        const record = await Record.find({tool_id : tool.tool_id} && {chamber_Num :chamber.serialNumber });
        if(record.length===0) res.json('no records were found');

        res.status(200).json(record);
    } catch (error) {
        conslo.log(error.body);
    }
  });

  router.put('/:recordId',auth,async(req,res)=>{
    //find the given record
    const record = await Record.findByIdAndUpdate(req.params.recordId,{
        date: req.body.date,
        description : req.body.description
    });
    if(!record) return res.status(404).send('record not found');
    res.json(record);
  });

  

module.exports = router;