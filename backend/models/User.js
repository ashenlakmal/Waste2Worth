const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    userType: {
        type: String,
        enum: ['Donor', 'Recipient', 'Both'],
        required: true
    },

    //User can edit after login
    profileImage: { type: String, default: "" },
    age: { type: Number },
    bio: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);