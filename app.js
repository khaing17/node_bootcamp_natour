const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');
const app = express();

//Routes
const tourRouter = require('./routes/tour.route');
const userRouter = require('./routes/user.route');

app.use(express.json());
app.use(morgan('dev'));

console.log('Node Env Variables', process.env.NODE_ENV);

//Routes Handler
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Error handling for unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
