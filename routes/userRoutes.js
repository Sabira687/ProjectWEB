const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isCreator } = require('../middleware/authMiddleware');

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/follow/:id', verifyToken, userController.followCreator);
router.get('/followers', verifyToken, isCreator, userController.getFollowers);
router.delete('/followers/:followerId', verifyToken, isCreator, userController.removeFollower);

module.exports = router;