const router = require('express').Router();
const Request = require('../models/Request');
const Listing = require('../models/Listing');

// 1. Add New Request
router.post('/add', async (req, res) => {
    try {
        const { listingId, recipientId, donorId, purpose } = req.body;
        if (!donorId) return res.status(400).json({ message: "Missing donor information." });

        // Check if ANY request exists for this item by this user (Pending, Accepted, Rejected, Completed)
        const existingRequest = await Request.findOne({
            listingId,
            recipientId
        });

        // If found, block new request
        if (existingRequest) {
            return res.status(400).json({ message: "You have already requested this item (or it was rejected)." });
        }

        const newRequest = new Request({ listingId, recipientId, donorId, purpose, status: 'Pending' });
        const savedRequest = await newRequest.save();
        res.status(200).json(savedRequest);
    } catch (err) { res.status(500).json({ message: "Request failed", error: err.message }); }
});

// 2. Get Requests by User (Recipient's Requests) - FIXED & DEBUGGED
router.get('/my/:userId', async (req, res) => {
    try {
        const requests = await Request.find({ recipientId: req.params.userId })
            .populate('listingId') // details of the listing
            .populate('donorId')   // details of the donor
            .sort({ createdAt: -1 });

        // Debugging: Log populated requests

        res.status(200).json(requests);
    } catch (err) {
        console.error("Population Error:", err);
        res.status(500).json(err);
    }
});

// 3. Get Requests Received by Donor
router.get('/received/:donorId', async (req, res) => {
    try {
        const requests = await Request.find({ donorId: req.params.donorId })
            // get recipient details and listing details
            .populate('recipientId', 'firstName lastName email profileImage phone')
            .populate('listingId', 'title images status')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 4. Handle Request Action (Approve, Reject, Sent, Completed)
router.put('/action/:requestId', async (req, res) => {
    try {
        const { status } = req.body; // 'Accepted', 'Rejected', 'Sent', 'Completed'
        const request = await Request.findById(req.params.requestId);

        if (!request) return res.status(404).json("Request not found");

        // 1. Update Request Status
        request.status = status;
        await request.save();

        // 2. If APPROVED -> Listing becomes 'Pending'
        if (status === 'Accepted') {
            await Listing.findByIdAndUpdate(request.listingId, { status: 'Pending' });
        }

        // 3. If REJECTED -> Listing becomes 'Active' again 
        if (status === 'Rejected') {
            await Listing.findByIdAndUpdate(request.listingId, { status: 'Active' });
        }

        // 4. If COMPLETED (Received) -> Listing becomes 'Closed'
        if (status === 'Completed') {
            await Listing.findByIdAndUpdate(request.listingId, { status: 'Closed' });
        }

        res.status(200).json(request);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 5. Update Delivery Details for a Request
router.put('/update-delivery/:requestId', async (req, res) => {
    try {
        const { deliveryAddress, contactNumber } = req.body;
        const request = await Request.findByIdAndUpdate(
            req.params.requestId,
            { deliveryAddress, contactNumber },
            { new: true }
        );
        res.status(200).json(request);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;