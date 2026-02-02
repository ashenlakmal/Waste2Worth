const router = require('express').Router();
const Listing = require('../models/Listing');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// 1. Add Listing
router.post('/add', upload.array('listingImages', 5), async (req, res) => {
    try {
        const { donor, title, description, category, listingType, price, deadline, collectionMethod, location } = req.body;
        let imageUrls = [];
        if (req.files) imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);

        const newListing = new Listing({
            donor, title, description, category, listingType, price, deadline, collectionMethod, location,
            images: imageUrls, status: 'Active'
        });
        const savedListing = await newListing.save();
        res.status(200).json(savedListing);
    } catch (err) { res.status(500).json(err); }
});

// 2. Get Listings by Donor (My Listings)
router.get('/my/:userId', async (req, res) => {
    try {
        const listings = await Listing.find({ donor: req.params.userId })
            .populate('category', 'name') // display only category name
            .sort({ createdAt: -1 });

        res.status(200).json(listings);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. Delete Listing
router.delete('/delete/:id', async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

// 4. Update Listing
router.put('/update/:id', upload.array('listingImages', 5), async (req, res) => {
    try {
        const { title, description, category, listingType, price, deadline, collectionMethod, location } = req.body;
        let updateData = { title, description, category, listingType, price, deadline, collectionMethod, location };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
        }

        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.status(200).json(updatedListing);
    } catch (err) { res.status(500).json(err); }
});

// 5. Get Feed (Active Listings)
router.get('/feed/all', async (req, res) => {
    try {
        // show only Active listings whose deadline is not passed
        const currentDate = new Date();
        const listings = await Listing.find({
            status: 'Active',
            deadline: { $gte: currentDate }
        })
            .populate('category', 'name')
            .populate('donor', 'firstName lastName email profileImage') // show limited donor info
            .sort({ createdAt: -1 });

        res.status(200).json(listings);
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;