const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION! Shutting down...');
  process.exit(1);
});
const app = require('./app');

const DB = process.env.DB;

console.log(DB);

mongoose.connect(DB).then((con) => {
  console.log(con.connection.host);
  console.log('Database connection established!');
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App listening on ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

console.log(x);
