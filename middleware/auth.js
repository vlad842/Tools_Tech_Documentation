const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

module.exports = function  (req,res,next){
    const token = req.header('x-auth');
    if(!token) return res.status(401).send('access denied. no token provided');

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}