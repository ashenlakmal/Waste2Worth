const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    // 1. DonorUserID: connects to User model
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 2. Title & Description
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },

    // 3. CategoryID: connects to Category model
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Category model connects
        required: true
    },

    // 4. ListingType: either donation or exchange
    listingType: {
        type: String,
        required: true,
        enum: ['Donation', 'Exchange'],
        default: 'Donation'
    },

    // 5. Price: if donation then 0, else set by donor
    price: {
        type: Number,
        default: 0
    },

    // 6. DeadlineDate: after which listing is closed
    deadline: {
        type: Date,
        required: false
    },

    // 7. Status: Active, Pending, Closed
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Closed'],
        default: 'Active'
    },

    // 8. CollectionMethod: physical pickup or delivery
    collectionMethod: {
        type: String,
        enum: ['Pickup', 'Delivery'],
        required: [true, 'Please select collection method']
    },

    // 9. Location: important for "Location-Based Search" 
    location: {
        type: String,
        required: [true, 'Please add the location']
    },

    // 10. Images: hold multiple image URLs
    images: {
        type: [String], // images are an array of strings 
        default: []
    }

}, { timestamps: true }); // automatic createdAt and updatedAt

module.exports = mongoose.model('Listing', ListingSchema);