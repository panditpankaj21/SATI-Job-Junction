const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getCurrentUser,
    sendOTP,
    verifyOTP,
    uploadAvatar,
    saveItem,
    getSavedItems,
    unsaveItem,
    addRecentSearch,
    getRecentSearches
} = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/auth.middleware');
const upload= require('../middlewares/upload.middleware')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(verifyJWT, getCurrentUser);
router.route('/send-otp').post(verifyJWT, sendOTP);
router.route('/verify-otp').post(verifyJWT, verifyOTP);
router.route('/avatar').patch(verifyJWT, upload.single('avatar'), uploadAvatar)
router.route('/save-item').post(verifyJWT, saveItem)
router.route('/get-saved-items').get(verifyJWT, getSavedItems)
router.route('/unsave-item/:postId').delete(verifyJWT, unsaveItem)
router.route('/add-recent-search').post(verifyJWT, addRecentSearch)
router.route('/get-recent-searches').get(verifyJWT, getRecentSearches)

module.exports = router;
