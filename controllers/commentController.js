const Post = require('../models/Post');
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

        await Post.findByIdAndUpdate(postId, {
            $push: {comments: comment._id}
        });

        const populatedComment = await comment.populate('author', 'email');
        res.status(201).json(populatedComment);
    } catch (error) {
        console.warn("Comment Save Error:", error);
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

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.userId;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({message: "Comment not found"});

        if (comment.author.toString() !== userId) {
            return res.status(403).json({message: "You can only delete your own comments"});
        }
        await Post.findByIdAndUpdate(comment.post, {
            $pull: {comments: commentId}
        });

        await comment.deleteOne();

        res.json({message: "Comment deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};