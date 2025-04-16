const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendation.controller');
const verifyJWT = require('../middlewares/auth.middleware');

// Get recommendations for the authenticated user
router.get('/', verifyJWT, getRecommendations);

module.exports = router; 