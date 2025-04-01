const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'You are not authorized' });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user = await User.findById(decodedToken?._id).select('-password');
        if (!user) {
            console.log('No user found');
            return res.status(401).json({ message: 'You are not authorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = verifyJWT;
