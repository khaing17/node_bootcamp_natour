const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tour.route');
const userRouter = require('./routes/user.route');

app.use(express.json());
app.use(morgan('dev'));

console.log('Node Env Variables', process.env.NODE_ENV);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
