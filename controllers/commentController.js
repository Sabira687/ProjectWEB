const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const {content, postId} = req.body;
        const comment = new Comment({
            content,
            author: req.userId,
            post: postId
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({post: req.params.postId})
            .populate('author', 'profile.name profile.avatar');
        res.json(comments);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};