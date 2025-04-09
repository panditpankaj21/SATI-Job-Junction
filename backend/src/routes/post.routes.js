const router = require('express').Router();
const Post = require('../models/post.model');
const { 
    allPosts, 
    getPost, 
    addPost, 
    updatePost, 
    deletePost,
    upvotePost,
    getUpvoteStatus
} = require('../controllers/post.controller');

router.route('/').get(allPosts);
router.route('/add').post(addPost);
router.route('/:id').get(getPost);  
router.route('/:id').delete(deletePost);
router.route('/update/:id').post(updatePost);
router.route('/:id/upvote').post(upvotePost);
router.route('/:id/upvote-status').get(getUpvoteStatus);

module.exports = router;