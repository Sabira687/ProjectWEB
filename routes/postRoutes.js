const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken, isCreator } = require('../middleware/authMiddleware');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

router.post('/:id/like', verifyToken, postController.toggleLike);

router.post('/', verifyToken, isCreator, postController.createPost);
router.put('/:id', verifyToken, isCreator, postController.updatePost);
router.delete('/:id', verifyToken, isCreator, postController.deletePost);

module.exports = router;