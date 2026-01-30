const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Routes මුලින්ම Import කරන්න [cite: 72]

// Config
dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // JSON දත්ත කියවීමට [cite: 306, 307]
app.use(cors());

// MongoDB Connection [cite: 78, 307]
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas එකට සාර්ථකව සම්බන්ධ වුණා!"))
    .catch((err) => console.error("❌ Connection Error: ", err));

// Routes - සර්වර් එක Listen කරන්න පෙර Routes සම්බන්ධ කරන්න [cite: 73]
app.use('/api', authRoutes);

// සර්වර් එක ක්‍රියාත්මක කිරීම [cite: 320]
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 සර්වර් එක port ${PORT} මගින් ක්‍රියාත්මක වේ.`);
});