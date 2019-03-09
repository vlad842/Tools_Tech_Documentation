const mongoose = require('mongoose');
const { UserSchema } = require('./user');
const { ToolSchema } = require('./tool');
const { ChamberSchema } = require('./chamber');
const {commentSchema} = require('../models/comment');
const {tag} = require('./tag');
const Joi = require('joi');

const Record = mongoose.model('Record', new mongoose.Schema({

    tool_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    chamber_num: {
        type: Number,
    },

    chamber_index: {
        type: Number,
    },

    headline: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30
    },

    tags: [{type:mongoose.Schema.Types.ObjectId, ref:'tag'}] ,

    event: {
        type: String,
        required: true,
        enum: ['Monitors out of control', 'Inline out of control', 'Tool error',
            'E3 abort/warnings', 'Sub Fab/ISYS', 'Communication', 'Eqp Upgrade', 'other']
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    description: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 255
    },

    comments:{
        type : [commentSchema],
        minlength : 0,
        maxlength : 50
    } ,

    status: {
        type: String,
        enum: ['Resolved', 'Resolved and follow up', 'In progress'],
        required: true
    }
}));

function validateRecord(record) {
    const schema = {
        tool_id: Joi.string().required(),
        description: Joi.string().required(),
        //comments : Joi.object(commentSchema).minlength(0).maxlength(50),
        tags : Joi.array(),
        chamber_num: Joi.number().min(1).max(5).required(),
        chamber_kind: Joi.string().valid(['RTC', 'RC', 'TI', 'PLY', 'BE']),
        headline: Joi.string().required().max(30).min(1),
        status: Joi.string().valid(['Resolved', 'Resolved and follow up', 'In progress']).required(),
        event: Joi.string().valid(['Monitors out of control', 'Inline out of control', 'Tool error',
            'E3 abort/warnings', 'Sub Fab/ISYS', 'Communication', 'Eqp Upgrade', 'other']).required()
    };
    return Joi.validate(record, schema);
}

exports.Record = Record;
exports.validateRecord = validateRecord;
