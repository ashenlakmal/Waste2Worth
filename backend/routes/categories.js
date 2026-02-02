const router = require('express').Router();
const Category = require('../models/Category');

// 1. Add Category
router.post('/add', async (req, res) => {
    try {
        const newCategory = new Category({
            name: req.body.name // CategoryName
        });
        const savedCategory = await newCategory.save();
        res.status(200).json(savedCategory);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. Get All Categories 
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;