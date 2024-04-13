const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const generateJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmed: req.body.passwordConfirmed,
  });

  const token = generateJWTToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //Check email and password exist

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //Check if password and email is correct

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = generateJWTToken(user._id);

  //If everything is ok, send token to client
  res.status(200).json({
    status: 'success',
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError("You're not logged in! Please login to get access.")
    );
  }
  //get the token and check if it's there

  //verify the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decode);

  //check if the user still exists

  //check if the user still exists

  //check if the user changed the password after the token was issued
  next();
});

module.exports = {
  signUp,
  logIn,
  protect,
};
