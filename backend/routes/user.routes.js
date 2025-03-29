const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { 
    registerUser, 
    loginUser, 
    getCurrentUser,
    sendOTP,
    verifyOTP
} = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/auth.middleware');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(verifyJWT, getCurrentUser);
router.route('/send-otp').post(verifyJWT, sendOTP);
router.route('/verify-otp').post(verifyJWT, verifyOTP);

module.exports = router;
