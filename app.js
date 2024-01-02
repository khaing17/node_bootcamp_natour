const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tour.route');
const userRouter = require('./routes/user.route');

app.use(express.json());

app.use(morgan('dev'));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
