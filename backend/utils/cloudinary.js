const cloudinary = require('cloudinary').v2;
require('dotenv').config()
const fs = require('fs')

async function uploadOnCloudinary(file){
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
    try{
        const result = await cloudinary.uploader.upload(file)
        fs.unlinkSync(file)
        return result.secure_url


    }catch(error){
        fs.unlinkSync(file)
        console.log(error)
    }
}

module.exports = uploadOnCloudinary