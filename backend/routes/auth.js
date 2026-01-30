const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, location, phone, userType, password } = req.body;

        // 1. පද්ධතියට දත්ත ලැබෙනවාද කියා console එකේ බලන්න (පසුව මෙය ඉවත් කරන්න)
        console.log("දත්ත ලැබුණා:", req.body);

        // 2. Email එක පරීක්ෂා කිරීම
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists!" });

        // 3. Password එක Hash කිරීම
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. දත්ත ගබඩා කිරීම
        const newUser = new User({
            firstName,
            lastName,
            email,
            location,
            phone,
            userType,
            password: hashedPassword // Hash කළ මුරපදය මෙතැනට වැටේ
        });

        const savedUser = await newUser.save();
        res.status(200).json({ message: "Success!" });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Login Route
// auth.js හි ලොගින් කොටස මෙසේ වෙනස් කර බලන්න
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        // පරිශීලකයා නොමැති නම් හෝ password එක වැරදි නම් එකම මැසේජ් එකක් දෙන්න
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

module.exports = router;