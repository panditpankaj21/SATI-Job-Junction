const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getCurrentUser,
    sendOTP,
    verifyOTP,
    uploadAvatar
} = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/auth.middleware');
const upload= require('../middlewares/upload.middleware')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(verifyJWT, getCurrentUser);
router.route('/send-otp').post(verifyJWT, sendOTP);
router.route('/verify-otp').post(verifyJWT, verifyOTP);
router.route('/avatar').patch(verifyJWT, upload.single('avatar'), uploadAvatar)

module.exports = router;
