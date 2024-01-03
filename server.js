const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DB;

console.log(DB);

mongoose.connect(DB).then((con) => {
  console.log(con.connection.host);
  console.log('Database connection established!');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
