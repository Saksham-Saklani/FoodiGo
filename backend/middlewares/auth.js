const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = (req, res,next) => {
    try{
        const token = req.cookies.token

        if(!token) {
            return res.status(401).json({message: 'Unauthorized: No token found'})
        }
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET)


            if(!decodeToken){
                return res.status(401).json({message: 'Unauthorized: Invalid token'})
            } 
            req.userId = decodeToken.userId

            next()
    }catch(error){
        res.status(500).json({message: 'Auth Error'})
    }
}

module.exports = auth