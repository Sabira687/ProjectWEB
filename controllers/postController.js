const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    try {
        const { title, content, tags, images, links } = req.body;
        const newPost = new Post({
            title, content, tags, images, links,
            author: req.userId
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const { search, tag } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (tag) {
            query.tags = tag;
        }

        const posts = await Post.find(query)
            .populate('author', 'profile.name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.userId);

        if (post.likes.includes(req.userId)) {
            post.likes = post.likes.filter(id => id.toString() !== req.userId);
            user.likedPosts = user.likedPosts.filter(id => id.toString() !== post._id.toString());
        } else {
            post.likes.push(req.userId);
            user.likedPosts.push(post._id);
        }

        await post.save();
        await user.save();
        res.json({ message: 'Success', likesCount: post.likes.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};