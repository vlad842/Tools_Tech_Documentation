const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const config = require('config');

module.exports = function  (req,res,next){
    const token = req.header('x-auth');
    if(!token) return res.status(401).send('access denied. no token provided');

    try {
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}