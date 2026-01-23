const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const {generateToken} = require('../utils/token');
const { sendOtpMail } = require('../utils/mail');

async function registerUser(req, res) {
    try{
        const { fullname, email, password, mobile, role } = req.body;

    let user = await userModel.findOne({email})

    if(user){
        return res.status(400).json({message: "User already exists"});
    }

    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    if(mobile.length < 10){
        return res.status(400).json({message: "Mobile number must be at least 10 digits"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await userModel.create({
        fullname,
        email,
        password: hashedPassword,
        mobile,
        role
    });

    const token = await generateToken(user._id);
    res.cookie('token', token)


    res.status(201).json({message: "Registration successful", user})

    }catch(err){
        res.status(500).json(`Register error: ${err}`)
    }
}

async function loginUser(req, res){
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({message: "User not found, please register first"})
        }

        const matchPassword =  await bcrypt.compare(password, user.password)

        if(!matchPassword){
            return res.status(401).json({message: "Invalid password"})
        }

        const token = await generateToken(user._id)
        res.cookie('token', token)

        res.status(200).json({message: "Login successful", user})

    } catch (error) {
        res.status(500).json(`Login error: ${error}`)
    }
}

async function logoutUser(req,res){
    try {
        res.clearCookie('token')
        res.status(200).json({message: "Logout successful"})
    } catch (error) {
        res.status(500).json(`Logout error: ${error}`)
    }
}

async function sendOtp(req, res){
    try{
        const { email } = req.body

        let user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({message: 'User not found'})
        }

        const otp = Math.floor(1000 + Math.random() * 9000)

        user.otp = otp
        user.otpExpiry = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false

        await user.save()

        await sendOtpMail(email, otp)

        return res.status(200).json({message: 'OTP sent to your email'})

    } catch(error){
        return res.status(500).json({message: 'OTP Error: ', error})
    }
}

async function verifyOtp(req, res){
    try{
        const { email, otp } = req.body

        let user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({message: "User not found"})
        }
        const otpNumber = Number(otp)
        if(user.otp !== otpNumber){
            return res.status(400).json({message: "Invalid OTP"})
        }

        if(user.otpExpiry < Date.now()){
            return res.status(400).json({message: "OTP expired"})
        }

        user.otp = undefined
        user.otpExpiry= undefined
        user.isOtpVerified = true

        await user.save()

        return res.status(200).json({message: "OTP verified successfully"})
        
    } catch(error){
        return res.status(500).json({message: "OTP Verification Error: ", error})
    }
}

async function resetPassword(req, res){
    try{
        const { email, newPassword, confirmPassword } = req.body

        let user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"})
        }
        if(newPassword.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()

        return res.status(200).json({message: "Password reset successfully"})

    } catch(error){
        return res.status(500).json({message: "Password Reset Error: ", error})
    }
}

async function googleSignIn(req, res){
    try{
        const { fullname, email, mobile, role } = req.body

        let user = await userModel.findOne({email})

        if(!user){
            user = await userModel.create({
                fullname,
                email,
                mobile,
                role
            })
        }

        const token = await generateToken(user._id)
        res.cookie('token', token)

        res.status(200).json({message: "Google Sign In successful", user})

    } catch(error){
        res.status(500).json({message: "Google Sign In Error: ", error})
    }
}

module.exports = {registerUser, loginUser, logoutUser, sendOtp, verifyOtp, resetPassword, googleSignIn};