const Post = require('../models/Post');
const User = require('../models/User');

exports.getAllPosts = async (req, res) => {
    try {
        const {search, tag} = req.query;
        let query = {};
        if (search) query.title = {$regex: search, $options: 'i'};
        if (tag) query.tags = {$in: [tag]};

        const posts = await Post.find(query).populate('author', 'profile.name').sort({createdAt: -1});
        res.json(posts);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'profile.name profile.avatar');
        if (!post) return res.status(404).json({message: 'Post not found'});
        res.json(post);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.createPost = async (req, res) => {
    try {
        const post = new Post({...req.body, author: req.userId});
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate(
            {_id: req.params.id, author: req.userId},
            req.body,
            {new: true}
        );
        if (!post) return res.status(404).json({message: 'Post not found or unauthorized'});
        res.json(post);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({_id: req.params.id, author: req.userId});
        if (!post) return res.status(404).json({message: 'Post not found or unauthorized'});
        res.json({message: 'Post deleted'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.userId);
        if (post.likes.includes(req.userId)) {
            post.likes.pull(req.userId);
            user.likedPosts.pull(post._id);
        } else {
            post.likes.push(req.userId);
            user.likedPosts.push(post._id);
        }
        await post.save();
        await user.save();
        res.json({likes: post.likes.length});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};