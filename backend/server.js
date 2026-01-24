const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// config
dotenv.config();
const app = express();

// middleware
app.use(express.json()); app.use(cors());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected!"))
  .catch((err) => console.error("❌ Connection Error: ", err));



// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Run in port ${PORT}`);
});



