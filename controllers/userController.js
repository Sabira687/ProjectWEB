const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-password')
            .populate('likedPosts')
            .populate('following', 'profile.name profile.avatar');

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { "profile.name": name, "profile.bio": bio, "profile.avatar": avatar } },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.followCreator = async (req, res) => {
    try {
        const creatorId = req.params.id;
        const userId = req.userId;

        if (creatorId === userId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const user = await User.findById(userId);
        const isFollowing = user.following.includes(creatorId);

        if (isFollowing) {
            user.following.pull(creatorId);
        } else {
            user.following.push(creatorId);
        }

        await user.save();
        res.json({
            message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
            followingCount: user.following.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const followers = await User.find({ following: req.userId }, 'profile.name email profile.avatar');
        res.json(followers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFollower = async (req, res) => {
    try {
        const { followerId } = req.params;
        const creatorId = req.userId;

        await User.findByIdAndUpdate(followerId, {
            $pull: { following: creatorId }
        });

        res.json({ message: "Follower removed from your list" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};