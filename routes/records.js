const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {Tool} =require('../models/tool');
const {Chamber} = require('../models/chamber');
const {User} = require('../models/user')
const {Record,validateRecord} = require('../models/record');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


/*router.get('/',async (req,res)=>{
    const records = await getRecordes(undefined,undefined);
    res.status(200).json(records);
})*/

router.post('/addRecord',auth, async (req,res) => {
const{error} = validateRecord(req.body); 
if (error) return res.status(400).send(error.details[0].message);

const {tool_id, chamber_num, headline, tags, event, description, status} = req.body;
let res_status= 200;
let data = {};

let user_id = req.user.id;
try {
    const chamber_index = chamber_num - 1;
    const recordToInsert = new Record({tool_id, chamber_index, chamber_num, headline, tags, event, user_id, description, status});
    const result = await recordToInsert.save();
    data= result;
    
} catch (error) {
    res_status= 400;
    data = error;
}
res.status(res_status).json(data);
});

/*router.get('/:toolId', async (req,res)=>{
        const tool = await Tool.findById(req.params.toolId);
        if(!tool) return res.status(404).send('tool number is not valid');
        const record = await getRecordes(tool._id,undefined);
        res.status(200).json(record);
})*/

router.get('/:tag_id/:tool_id/:chamber_number/:status', async (req, res) => {
    let {tag_id, tool_id, chamber_number,status} = req.params;
    tag_id = tag_id !== '*'? tag_id : undefined;
    tool_id = tool_id !== '*'? tool_id : undefined;
    chamber_number = chamber_number !== '*'? chamber_number : undefined;
    status = status !== '*'? status : undefined;
    try {
        ///find the given tool and chamber for validation
        if(tool_id){
            const tool = await Tool.findById(tool_id);
            if(tool){
                tool_id = tool._id;
                if(chamber_number){
                    const chamber = tool.chambers[chamber_number - 1];
                    chamber_number = chamber.serialNumber;
                }
            }
            else{
                return res.status(404).send('tool number is not valid');
            }

        }
        //find if a record exists for given tool and chamber
        const record = await getRecordes(tag_id,tool_id,chamber_number,status);

        res.status(200).json(record);
    } catch (error) {
        console.log(error);
    }
  });

  router.put('/:recordId',auth,async(req,res)=>{
    //find the given record
    const record = await Record.findOneAndUpdate(req.params.recordId,{
        headline : req.body.headline,
        description : req.body.description,
        date: Date.now().toFixed(),
        status: req.body.status
    });
    if(!record) return res.status(404).send('record not found');
    res.json(record);
  });


  async function getRecordes(tag_id,tool_id, chamber_num,status)
  {
    let match_obj = {};
    let query = [
        {
            $unwind:{
                path:"$comments",
                preserveNullAndEmptyArrays: true
            }
        }
        ,
        {
             $addFields: { 
                 "comment_tags_ids": { $ifNull: [ "$comments.tag_ids", [] ] },
                "comments": { $ifNull: [ "$comments", [] ] } 
                } 
        }
        ,
        {
            $unwind:{
                path:"$comment_tags_ids",
                preserveNullAndEmptyArrays: true
            }
        },
        {
             $addFields: { 
                 "comment_tags_ids": { $ifNull: [ "$comment_tags_ids", [] ] }
                } 
        },
        {
            $lookup:{
                        
                from: "tag",
                localField: "comment_tags_ids",
                foreignField: "_id",
                as: "tag_data"
                       
            }
        }
        ,
        {
                $unwind:{
                    path:"$tag_data",
                preserveNullAndEmptyArrays: true
                }
        }
        ,
        {
             $addFields: { 
                 "tag_data": { $ifNull: [ "$tag_data", {} ] }
                } 
        }
        ,
        {
            $lookup:{
                        
                from: "users",
                localField: "comments.user_id",
                foreignField: "_id",
                as: "user_data"
                       
            }
        }
        ,
        {
                $unwind:{
                    path:"$user_data",
                preserveNullAndEmptyArrays: true
                }
        }
        ,
        {
            $group:{
                _id:{
                    record_id:"$_id",
                    comment_id:"$comments._id",
                    comment_content:"$comments.content",
                    comment_date:"$comments.date",
                    tool_id:"$tool_id",
                    chamber_index:"$chamber_index",
                    chamber_num:"$chamber_num",
                    headline:"$headline",
                    event:"$event",
                    user_id:"$user_id",
                    description:"$description",
                    status:"$status",
                    date:"$date",
                    user_full_name:"$user_data.full_name"
                    
                    },
                tags:{$push:"$tag_data"}
            }
        },
        {
            $group:{
                _id:{
                    record_id:"$_id.record_id",
                    tool_id:"$_id.tool_id",
                    chamber_index:"$_id.chamber_index",
                    chamber_num:"$_id.chamber_num",
                    headline:"$_id.headline",
                    event:"$_id.event",
                    user_id:"$_id.user_id",
                    description:"$_id.description",
                    status:"$_id.status",
                    date:"$_id.date",
                    },
                comments:{
                    $push:{
                        tags:"$tags",
                        user_full_name:"$_id.user_full_name",
                        comment_content:"$_id.comment_content",
                        comment_date:"$_id.comment_date"
                    }
                }
            }
        },
        {
            $project:{
                    _id:"$_id.record_id",
                    tool_id:"$_id.tool_id",
                    chamber_index:"$_id.chamber_index",
                    chamber_num:"$_id.chamber_num",
                    headline:"$_id.headline",
                    event:"$_id.event",
                    user_id:"$_id.user_id",
                    description:"$_id.description",
                    status:"$_id.status",
                    date:"$_id.date",
                    comments:1
            }    
        },
        {
            $lookup:{
                
                 from: "tools",
                 localField: "tool_id",
                 foreignField: "_id",
                 as: "tool_data"
               
            }
        },
        /*{
            $project:{
                description: "$description",
                chamber_num: "$chamber_num",
                chamber_index: "$chamber_index",
                user_id: "$user_id",
                date: "$date",
                comments:1,
                tool_data: { $arrayElemAt: ["$tool_doc", 0 ] }
            }
        },*/
        {
            $unwind:{
                path:"$tool_data"
            }
        },
        {
            $project:{
                description: 1,
                user_id: 1,
                date: 1,
                headline:1,
                event:1,
                status:1,
                serial_number: "$tool_data.serialNumber",
                chamber_num: 1,
                comments:1,
                chamber_data: { $arrayElemAt: ["$tool_data.chambers", "$chamber_index" ] }
            }
        },
        {
            $project:{
                description: 1,
                user_id: 1,
                date: 1,
                headline:1,
                event:1,
                status:1,
                serial_number: 1,
                chamber_num: 1,
                comments:1,
                chamber_kind: "$chamber_data.kind"
            }
        },
        {
            $lookup:{
                
                 from: "users",
                 localField: "user_id",
                 foreignField: "_id",
                 as: "user_data"
               
            }
        },
        /*{
            $project:{
                description:1,
                date: 1,
                serial_number: 1,
                chamber_num: 1,
                chamber_kind: 1,
                comments:1,
                user_data: { $arrayElemAt: ["$user_doc", 0 ] }
            }
        },*/
        {
            $unwind:{
                path:"$user_data"
            }
        },
        {
            $project:{
                description: 1,
                date: 1,
                headline:1,
                event:1,
                status:1,
                serial_number: 1,
                chamber_num: 1,
                chamber_kind: 1,
                comments:1,
                user_name: "$user_data.full_name"
            }
        },
        {
            $sort:{date:-1}
        }
        ];

    if(tag_id){
        let obj = {'$match':{tags:ObjectId(tag_id)}};
        query.unshift(obj);
    }    
    if(status){
        let obj = {'$match':{status}};
        query.unshift(obj);
    }
    if(tool_id)
    {            
        if(chamber_num)
        {
            query.unshift({'$match':{tool_id,chamber_num}});

        }
        else
        {
            query.unshift({'$match':{tool_id}});

        }
    }
    const records = await Record.aggregate(query);

    records.forEach((record)=>{
        if(record.comments.length === 1 && record.comments[0].comment_content.length === 0)
            record.comments = [];
    })
    return records;
  }

module.exports = router;