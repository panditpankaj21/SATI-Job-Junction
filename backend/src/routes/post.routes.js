const router = require('express').Router();
const Post = require('../models/post.model');
const { allPosts, getPost, addPost, updatePost, deletePost } = require('../controllers/post.controller');

router.route('/').get(allPosts);
router.route('/add').post(addPost);
router.route('/:id').get(getPost);  
router.route('/:id').delete(deletePost);
router.route('/update/:id').post(updatePost);

module.exports = router;