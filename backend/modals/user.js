const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    bio: { type: String },
});

// Important: You must export the model so other files can use it
module.exports = mongoose.model('User', UserSchema);