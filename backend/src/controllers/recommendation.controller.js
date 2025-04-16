const recommendationService = require('../services/recommendation.service');

const getRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;
        const limit = parseInt(req.query.limit) || 5;

        const recommendations = await recommendationService.getRecommendations(userId, limit);

        res.status(200).json({
            success: true,
            recommendations,
            message: 'Recommendations fetched successfully'
        });
    } catch (error) {
        console.error('Error in getRecommendations controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations',
            error: error.message
        });
    }
};

module.exports = {
    getRecommendations
}; 