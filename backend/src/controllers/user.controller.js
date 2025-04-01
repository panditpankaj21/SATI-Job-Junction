const User = require("../models/user.model");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {cloudinary} = require('../config/cloudinary')
const fs = require('fs')

const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: 'Please fill in all fields'});
    }

    const existedUser = await User.findOne({email});
    if(existedUser){
        return res.status(400).json({message: 'User already exists'});
    }

    const user = await User.create({
        name,
        email,
        password
    })
    const token = await user.generateAccessToken();
    const createdUser = await User.findById(user._id).select('-password');
    res.status(201).json({
        user: createdUser,
        token,
        message: "User created successfully"
    });
}


const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Please fill in all fields'});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const isMatch = await user.matchPasswords(password);
    if(!isMatch){
        return res.status(400).json({message: 'Passwrod Incorrect'});
    }

    const token = await user.generateAccessToken();
    res.status(200).json({
        token,
        message: "User logged in successfully"
    });
}

const getCurrentUser = async (req, res) => {
    return res.status(200).json({
            user: req.user, 
            message: "User fetched successfully"
        })
}



// OTP Verification Section

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendOTP = async (req, res)=>{
    const otp = generateOTP();
    const user = req.user;
    user.otp = otp;
    user.otpExpires = new Date(new Date().getTime() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your Verification Code",
        html: `
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Thank you for registering at <strong>S.A.T.I. Job Junction</strong>. Just one more step before you get verified!</p>
            <p><strong>Please confirm your identity using the one-time passcode:</strong> <code>${otp}</code></p>
            <p><em>This code will expire in 10 minutes.</em></p>
            <p>Thank you,<br><strong>SATI Job Junction Team</strong></p>
            <hr>
            <p style="font-size: 12px; color: gray;">This is an automated message, please do not reply to this email.</p>
        `
    });
    
    res.status(200).json({message: 'OTP sent successfully'});
}

const verifyOTP = async (req, res) => {
    const {otp} = req.body;
    if(!otp){
        return res.status(400).json({message: 'Please enter OTP'});
    }
    const user = req.user;

    if(user.otp !== otp){
        return res.status(400).json({message: 'Invalid OTP'});
    }

    if(new Date() > user.otpExpires){
        return res.status(400).json({message: 'OTP expired'});
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({message: 'OTP verified successfully'});

}

const uploadAvatar = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Delete old avatar if exists
    if (req.body.oldPublicId) {
        try {
          await cloudinary.uploader.destroy(req.body.oldPublicId);
        } catch (error) {
          console.warn('Failed to delete old avatar:', error);
        }
    }
  
      // Upload to Cloudinary with transformations
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto',
        format: 'webp'
      });
  
      // Delete the temporary file
      fs.unlinkSync(req.file.path);
  
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: result.secure_url },
        { new: true }
      ).select('-password');
  
      res.status(200).json(user);
      
    } catch (error) {
      console.error('Avatar upload error:', error);
      
      // Clean up temp file if upload failed
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error('Error deleting temp file:', err);
        }
      }
      
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  };


module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    sendOTP,
    verifyOTP,
    uploadAvatar
};
