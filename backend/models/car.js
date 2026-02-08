const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },

    seats: { type: Number, default: 4 },
    fuel: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], default: "Petrol" },
    transmission: { type: String, enum: ["Manual", "Automatic"], default: "Automatic" },

    pricePerDay: { type: Number, required: true },

    images: [{ type: String }],   // array of image URLs

    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
