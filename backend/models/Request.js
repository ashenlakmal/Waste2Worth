const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purpose: { type: String, required: true },

    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Sent', 'Completed'],
        default: 'Pending'
    },

    deliveryAddress: { type: String, default: '' },
    contactNumber: { type: String, default: '' }

}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);