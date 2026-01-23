const express = require('express');
const { registerUser, loginUser, logoutUser,sendOtp, verifyOtp, resetPassword, googleSignIn } = require('../controllers/auth.controller');
const authRouter = express.Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.get('/logout', logoutUser)

authRouter.post('/send-otp', sendOtp)
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword)
authRouter.post('/google-signin', googleSignIn)

module.exports = authRouter;