const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('../../app');
const Tour = require('../../model/tour.model');
const { json } = require('express');
const User = require('../../model/user.model');
const Review = require('../../model/review.model');

const DB = process.env.DB;

console.log(DB);

mongoose.connect(DB).then((con) => {
  console.log(con.connection.host);
  console.log('Database connection established!');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`).toString());
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`).toString());
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`).toString()
);

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });

    await Tour.create(tours);
    await Review.create(reviews);
    console.log('data created!');
  } catch (error) {
    console.log('Error 😒😒', error);
    console.log('error creating');
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data deleted!');
  } catch (error) {
    console.log('Error 😒😒', error);
    console.log('error deleting');
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
