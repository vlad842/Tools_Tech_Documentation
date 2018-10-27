const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {Tool} =require('../models/tool');
const {Chamber} = require('../models/chamber');
const {User} = require('../models/user')
const {Record,validateRecord} = require('../models/record');
const mongoose = require('mongoose');

router.get('/',async (req,res)=>{
    const records = await Record.aggregate([
        {
            $lookup:{
                
                 from: "tools",
                 localField: "tool_id",
                 foreignField: "_id",
                 as: "tool_doc"
               
            }
        },
        {
            $project:{
                description: "$description",
                chamber_num: "$chamber_num",
                user_id: "$user_id",
                date: "$date",
                tool_data: { $arrayElemAt: ["$tool_doc", 0 ] }
            }
        },
        {
            $project:{
                description: "$description",
                user_id: "$user_id",
                date: "$date",
                serial_number: "$tool_data.serialNumber",
                chamber_num: "$chamber_num",
                chamber_data: { $arrayElemAt: ["$tool_data.chambers", "$chamber_num" ] }
            }
        },
        {
            $project:{
                description: "$description",
                user_id: "$user_id",
                date: "$date",
                serial_number: "$serial_number",
                chamber_num: "$chamber_num",
                chamber_kind: "$chamber_data.kind"
            }
        },
        {
            $lookup:{
                
                 from: "users",
                 localField: "user_id",
                 foreignField: "_id",
                 as: "user_doc"
               
            }
        },
        {
            $project:{
                description: "$description",
                date: "$date",
                serial_number: "$serial_number",
                chamber_num: "$chamber_num",
                chamber_kind: "$chamber_kind",
                user_data: { $arrayElemAt: ["$user_doc", 0 ] }
            }
        },
        {
            $project:{
                description: "$description",
                date: "$date",
                serial_number: "$serial_number",
                chamber_num: "$chamber_num",
                chamber_kind: "$chamber_kind",
                user_name: "$user_data.full_name"
            }
        },
        {
            $sort:{date:-1}
        }
        ]);

    res.status(200).json(records);
})








router.post('/addRecord',auth, async (req,res) => {
const{error} = validateRecord(req.body); 
if (error) return res.status(400).send(error.details[0].message);

const {tool_id, chamber_num, description, status} = req.body;
let res_status= 200;
let data = {};

let user_id = req.user.id;
try {
    const recordToInsert = new Record({tool_id, chamber_num, user_id, description, status});
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
        const record = await Record.find({tool_id : tool.tool_id} && {chamber_num :chamber.serialNumber });
        if(record.length===0) res.json('no records were found');

        res.status(200).json(record);
    } catch (error) {
        conslo.log(error.body);
    }
  });

  router.put('/:recordId',auth,async(req,res)=>{
    //find the given record
    const record = await Record.findOneAndUpdate(req.params.recordId,{
        description : req.body.description,
        date: Date.now().toFixed(),
        status: req.body.status
    });
    if(!record) return res.status(404).send('record not found');
    res.json(record);
  });

  

module.exports = router;