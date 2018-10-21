const express = require('express');
const router = express.Router();

router.post('/work', (req,res) => {

    console.log('work!!!');
});

router.get('/chamberKinds',(req,res)=>{
    //TODO: change to generic
    
    const hardcoded_chamber_kinds = ['RCT','RC','TI','PLY','BE'];
    res.status(200).json(hardcoded_chamber_kinds);
})

module.exports = router;