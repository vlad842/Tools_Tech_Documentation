const express = require('express');
const router = express.Router();

router.post('/work', (req,res) => {

    console.log('work!!!');
});

module.exports = router;