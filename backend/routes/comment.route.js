const experss = require('express')
const router = experss.Router();
const {
    createComment,
    getComments,
    deleteComment,
    editComment
} = require('../controllers/comment.controller')


router.route('/').post(createComment);
router.route('/post/:postId').get(getComments);
router.route('/:id').delete(deleteComment);
router.route('/:id').patch(editComment);


module.exports = router;