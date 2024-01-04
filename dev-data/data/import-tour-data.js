const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('../../app');
const Tour = require('../../model/tour.model');
const { json } = require('express');

const DB = process.env.DB;

console.log(DB);

mongoose.connect(DB).then((con) => {
  console.log(con.connection.host);
  console.log('Database connection established!');
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`).toString()
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('tour created!');
  } catch (error) {
    console.log('Error 😒😒', error);
    console.log('error creating');
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('tour deleted!');
  } catch (error) {
    console.log('Error 😒😒', error);
    console.log('error creating');
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
