const mongoose = require("mongoose");
const Car = require("./models/car");

// ---------------
// MongoDB URI
// ---------------
const MONGO_URI = "mongodb://127.0.0.1:27017/car-lease"; // adjust if different

// ---------------
// Sample car data
// ---------------
const cars = [
  {
    name: "Aurora LX",
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 35,
    image: "/assets/cars/car1.jpg",
    description: "Reliable compact sedan — great fuel economy, perfect for city driving."
  },
  {
    name: "Voyager S",
    make: "Honda",
    model: "Civic",
    year: 2021,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 38,
    image: "/assets/cars/car2.jpg",
    description: "Comfortable ride with modern features and excellent handling."
  },
  {
    name: "TrailMaster",
    make: "Ford",
    model: "Escape",
    year: 2023,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 52,
    image: "/assets/cars/car3.jpg",
    description: "Compact SUV — ideal for trips with extra luggage space and versatility."
  },
  {
    name: "CityCruise",
    make: "Hyundai",
    model: "Elantra",
    year: 2020,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 32,
    image: "/assets/cars/car4.jpg",
    description: "Affordable and efficient — the perfect daily rental for short stays."
  },
  {
    name: "Premium GT",
    make: "BMW",
    model: "3 Series",
    year: 2022,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 95,
    image: "/assets/cars/car5.jpg",
    description: "Luxury driving experience — sport handling and premium interior."
  },
  {
    name: "FamilyVan",
    make: "Kia",
    model: "Carnival",
    year: 2021,
    seats: 7,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 75,
    image: "/assets/cars/car6.jpg",
    description: "Spacious MPV for families or groups — lots of cargo and comfort."
  },
  {
    name: "EcoDrive",
    make: "Toyota",
    model: "Prius",
    year: 2020,
    seats: 5,
    transmission: "Automatic",
    fuel: "Hybrid",
    pricePerDay: 45,
    image: "/assets/cars/car7.jpg",
    description: "Hybrid economy car with excellent fuel efficiency and low emissions."
  },
  {
    name: "RoadRunner",
    make: "Mazda",
    model: "CX-5",
    year: 2022,
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 59,
    image: "/assets/cars/car8.jpg",
    description: "Stylish crossover with responsive steering and good comfort."
  },
  {
    name: "Compact Pro",
    make: "Volkswagen",
    model: "Polo",
    year: 2021,
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    pricePerDay: 29,
    image: "/assets/cars/car9.jpg",
    description: "Small and nimble — best for city parking and short hops."
  },
  {
    name: "AllTerrain",
    make: "Jeep",
    model: "Wrangler",
    year: 2023,
    seats: 4,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 110,
    image: "/assets/cars/car10.jpg",
    description: "Off-road capable vehicle for adventurous trips and rough roads."
  }
];

// ---------------
// Connect & seed
// ---------------
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await Car.deleteMany({});
    await Car.insertMany(cars);
    console.log("Seeded cars successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
