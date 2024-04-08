const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'user name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    role: {
        type: String,
        required: [true, 'user type is required'],
        enum: ['client', 'admin'],
        default: 'client'
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
