const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

   async function sendOtpMail(to, otp){
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: 'Reset Your Foodigo Password',
        html: `<p>Your OTP for password reset is <b>${otp}</b>. This OTP will expire in 5 minutes.</p>`
    })
  }

  module.exports = { sendOtpMail };