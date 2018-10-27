const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {Tool, validateTool} = require('../models/tool');

router.post('/addTool',auth,async (req,res)=>{

    const {serialNumber,chambers} = req.body;
    let toolToInsert = await Tool.findOne({serialNumber : req.body.serialNumber});
    if(toolToInsert) return res.status(400).send('tool already exists');
    let status =200;
    let data = {};

    try{
        const toolToInsert =new Tool({serialNumber, chambers});
        const result = await toolToInsert.save();
        data = result;
    }
    catch(error){
        status= 400;
        data = error;
    }
    res.status(status).json(data);
});

router.get('/getAllTools',auth,async (req,res)=>{
    console.log("!");
    let status =200;
    let data = {};

    try{
        const allTools = await Tool.find({});
        data = allTools;
    }
    catch(error){
        data = error;
        status = 400;
    }
    console.log('Data',data);
    res.status(status).json(data);
});

module.exports = router;