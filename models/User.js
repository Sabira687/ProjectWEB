const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['Reader', 'Creator'], default: 'Reader'},
    profile: {
        name: {type: String, default: 'New Blogger'},
        bio: {type: String, default: ''},
        avatar: {type: String, default: 'https://via.placeholder.com/150'}
    },
    likedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);