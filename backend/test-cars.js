// test-cars.js
const mongoose = require('mongoose');
const Car = require('./models/car');
const connectDB = require('./db/connect');

async function test() {
  await connectDB(); // connect to your MongoDB

  const cars = await Car.find();
  console.log('Cars in DB:', cars);

  mongoose.connection.close();
}

test().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
