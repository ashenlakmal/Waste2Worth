const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User');

// Config
dotenv.config();
const app = express();

// Middleware
app.use(express.json()); app.use(cors());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected!"))
    .catch((err) => console.error("❌ Connection Error: ", err));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server Run in  port ${PORT}.`);
});


//edduser route
app.post('/addUser', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send("User saved to MongoDB!");
    } catch (error) {
        res.status(400).send(error);
    }
});