const express = require('express');
const router = express.Router();
const {Tool, validateTool} = require('../models/tool');
router.post('/work', (req,res) => {

    console.log('work!!!');
});

router.post('/addTool',async (req,res)=>{

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

module.exports = router;