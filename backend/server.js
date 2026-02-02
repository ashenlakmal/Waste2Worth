//import libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

//Import Routes
const authRoutes = require('./routes/auth');
const listingRoute = require('./routes/listings');
const categoryRoute = require('./routes/categories');
const requestRoute = require('./routes/requests');


// Config
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Creating upload folder configuration
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" MongoDB Atlas Connected!"))
    .catch((err) => console.error(" Connection Error: ", err));


app.use('/api', authRoutes);
//Listings Route
app.use('/api/listings', listingRoute);

//Categories Route
app.use('/api/categories', categoryRoute);

//Requests Route
app.use('/api/requests', requestRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server Started At port ${PORT}`);
});