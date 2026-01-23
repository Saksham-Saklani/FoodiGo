const jwt = require('jsonwebtoken');
require('dotenv').config()

async function generateToken(userId){
   try {
    const token = jwt.sign({userId},process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
   } catch (error) {
    console.log('error:', error);
    return null;
   }
}

module.exports = {generateToken};