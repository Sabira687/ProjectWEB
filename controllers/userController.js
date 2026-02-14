const User = require('../models/User');

exports.followCreator = async (req, res) => {
    try {
        const creatorId = req.params.id;
        const user = await User.findById(req.userId);

        if (user.following.includes(creatorId)) {
            user.following = user.following.filter(id => id.toString() !== creatorId);
        } else {
            user.following.push(creatorId);
        }

        await user.save();
        res.json({ message: 'Subscription updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};