const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

//For registeration Route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, location, phone, userType, password } = req.body;

        console.log("Data recieved:", req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            location,
            phone,
            userType,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(200).json({ message: "Success!" });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// for saving profile image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); //give unique name to file
    }
});

const upload = multer({ storage: storage });

// upload profile image and update profile route
router.put('/update-profile/:id', upload.single('profileImage'), async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            // create the URL to access the uploaded image
            updateData.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Update failed", error: err.message });


    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password!" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid Email or Password!" });
        }

        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET || 'W2W_SECRET_KEY',
            { expiresIn: '1d' }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// profile update route 
router.put('/update/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // update only the fields sent in the request body
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update password route
router.put('/change-password/:id', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // find user by id
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found!" });

        // 2. validate current password
        // user.password is the hashed password stored in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect!" });
        }

        // 3. check if new password is same as old password
        const isSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isSameAsOld) {
            return res.status(400).json({ message: "New password cannot be the same as the old password!" });
        }

        // 4. hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // 5. database update
        await User.findByIdAndUpdate(req.params.id, {
            password: hashedNewPassword
        });

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
        // Console log the error for debugging
        console.error("Change Password Error:", err);
        res.status(500).json({ message: "Server error occurred!", error: err.message });
    }
});

module.exports = router;