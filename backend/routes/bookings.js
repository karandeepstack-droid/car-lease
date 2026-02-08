const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Car = require("../models/car");
const authMiddleware = require("../middleware/authMiddleware");

// --------------------------------------------------
// CREATE BOOKING  (User must be logged in)
// --------------------------------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Calculate price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid booking dates" });
    }

    // Use car.pricePerDay from DB
    const totalPrice = days * (car.pricePerDay || car.daily_price || 0);

    // Create booking
    const booking = await Booking.create({
      userId: req.user.userId,
      carId,
      startDate,
      endDate,
      totalPrice,
      status: "confirmed",
    });

    res.json({
      success: true,
      message: "Booking confirmed",
      booking,
    });
  } catch (err) {
    console.log("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------------------------------
// GET ALL BOOKINGS FOR LOGGED-IN USER
// --------------------------------------------------
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate("carId");

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.log("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------------------------------
// ADMIN: GET ALL BOOKINGS (OPTIONAL for future)
// --------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId carId");
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
