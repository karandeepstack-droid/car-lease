const express = require("express");
const cors = require("cors");

const connectDB = require("./db/connect");
const authMiddleware = require("./middleware/authMiddleware");

// ROUTES
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const bookingRoutes = require("./routes/bookings");

const app = express();
const PORT = 8000;

// ---------------------------------------
// MIDDLEWARE
// ---------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ---------------------------------------
// CONNECT DATABASE
// ---------------------------------------
connectDB();

// ---------------------------------------
// ROUTES
// ---------------------------------------
app.get("/", (req, res) => {
  res.send("Backend connected successfully 🚀");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Cars routes
app.use("/api/cars", carRoutes);

// Booking routes
app.use("/api/bookings", bookingRoutes);

// Protected test route (optional)
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route OK",
    userId: req.user.userId,
  });
});

// Sample test route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend" });
});

// ---------------------------------------
// START SERVER
// ---------------------------------------
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
