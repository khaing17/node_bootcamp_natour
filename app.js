const { rateLimit } = require('express-rate-limit');
const morgan = require('morgan');
const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use('/api', limiter);

console.log('Node Env Variables', process.env.NODE_ENV);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes
const auth = require('./routes/auth.route');
const tourRouter = require('./routes/tour.route');
const userRouter = require('./routes/user.route');

//Routes Handler
app.use('/api/v1/auth', auth);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Error handling for unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
