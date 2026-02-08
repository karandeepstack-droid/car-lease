const express = require('express');
const router = express.Router();
const Car = require('../models/car');

// GET all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json({ success: true, cars });
  } catch (err) {
    console.error('Cars fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ success: true, car });
  } catch (err) {
    console.error('Car fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
