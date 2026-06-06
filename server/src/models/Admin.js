const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: false,
        sparse: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
