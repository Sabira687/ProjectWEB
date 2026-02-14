const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:postId', commentController.getPostComments);
router.post('/', verifyToken, commentController.addComment);

module.exports = router;