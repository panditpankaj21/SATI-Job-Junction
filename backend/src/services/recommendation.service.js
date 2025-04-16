const Post = require('../models/post.model');
const User = require('../models/user.model');

class RecommendationService {
    constructor() {
        this.contentWeight = 0.3; // 30%
        this.companyWeight = 0.3; // 30%
        this.popularityWeight = 0.2; // 20%
        this.searchWeight = 0.2; // 20%
    }

    // Calculate content similarity between two posts
    async calculateContentSimilarity(post1, post2) {
        const titleSimilarity = this.calculateTextSimilarity(post1.title, post2.title);
        const contentSimilarity = this.calculateTextSimilarity(post1.content, post2.content);
        return (titleSimilarity + contentSimilarity) / 2;
    }

    // Simple text similarity calculation
    calculateTextSimilarity(text1, text2) {
        const words1 = new Set(text1.toLowerCase().split(/\W+/));
        const words2 = new Set(text2.toLowerCase().split(/\W+/));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    // Calculate company relevance score
    calculateCompanyRelevance(post1, post2) {
        return post1.companyName.toLowerCase() === post2.companyName.toLowerCase() ? 1 : 0;
    }

    // Calculate popularity score
    calculatePopularityScore(post) {
        const maxUpvotes = 100; // Normalization factor
        const maxViews = 1000; // Normalization factor
        
        const upvoteScore = Math.min(post.upvotes / maxUpvotes, 1);
        const viewScore = Math.min(post.views / maxViews, 1);
        
        return (upvoteScore + viewScore) / 2;
    }

    // Calculate search relevance score
    calculateSearchRelevance(post, recentSearches) {
        if (!recentSearches || recentSearches.length === 0) return 0;

        const postContent = (post.title + ' ' + post.content + ' ' + post.companyName).toLowerCase();
        const searchTerms = recentSearches.map(term => term.toLowerCase());

        // Check if post matches any recent search terms
        const matches = searchTerms.filter(term => 
            postContent.includes(term) || 
            post.companyName.toLowerCase().includes(term)
        );

        return matches.length / searchTerms.length;
    }

    // Get recommendations for a user
    async getRecommendations(userId, limit = 5) {
        try {
            // Get user's data
            const user = await User.findById(userId);
            const userPosts = await Post.find({ user: userId });
            
            // Get all posts except user's own posts and already viewed posts
            const allPosts = await Post.find({ 
                user: { $ne: userId },
                _id: { $nin: user.postsViewed || [] }
            }).populate('user', '-password');

            // If user is new (no posts, no viewed posts, no recent searches)
            const isNewUser = userPosts.length === 0 && 
                            (!user.postsViewed || user.postsViewed.length === 0) && 
                            (!user.recentSearches || user.recentSearches.length === 0);

            if (isNewUser) {
                // For new users, return mix of most upvoted and recent posts
                const mostUpvoted = [...allPosts]
                    .sort((a, b) => b.upvotes - a.upvotes)
                    .slice(0, Math.ceil(limit * 0.7)); // 70% most upvoted

                const recentPosts = [...allPosts]
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .slice(0, Math.ceil(limit * 0.3)); // 30% most recent

                // Combine and remove duplicates
                const combined = [...new Set([...mostUpvoted, ...recentPosts])];
                return combined.slice(0, limit);
            }

            // Calculate scores for each post
            const scoredPosts = await Promise.all(allPosts.map(async (post) => {
                let totalScore = 0;

                // Content similarity (compare with user's posts)
                const contentScores = await Promise.all(
                    userPosts.map(userPost => this.calculateContentSimilarity(userPost, post))
                );
                const contentScore = contentScores.length > 0 
                    ? contentScores.reduce((a, b) => a + b) / contentScores.length 
                    : 0;

                // Company relevance
                const companyScores = userPosts.map(userPost => 
                    this.calculateCompanyRelevance(userPost, post)
                );
                const companyScore = companyScores.length > 0 
                    ? companyScores.reduce((a, b) => a + b) / companyScores.length 
                    : 0;

                // Popularity score
                const popularityScore = this.calculatePopularityScore(post);

                // Search relevance score
                const searchScore = this.calculateSearchRelevance(post, user.recentSearches);

                // Calculate total score
                totalScore = 
                    (contentScore * this.contentWeight) +
                    (companyScore * this.companyWeight) +
                    (popularityScore * this.popularityWeight) +
                    (searchScore * this.searchWeight);

                return {
                    post,
                    score: totalScore
                };
            }));

            // Sort by score and return top recommendations
            const recommendations = scoredPosts
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .map(item => item.post);

            // If we don't have enough recommendations, add random posts
            if (recommendations.length < limit) {
                const remainingPosts = allPosts.filter(post => 
                    !recommendations.some(rec => rec._id.toString() === post._id.toString())
                );
                
                // Shuffle remaining posts
                const shuffledPosts = remainingPosts.sort(() => Math.random() - 0.5);
                recommendations.push(...shuffledPosts.slice(0, limit - recommendations.length));
            }

            return recommendations;
        } catch (error) {
            console.error('Error in getRecommendations:', error);
            throw error;
        }
    }
}

module.exports = new RecommendationService(); 