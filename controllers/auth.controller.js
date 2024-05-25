const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/email');

const generateJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (user, statusCode, res) => {
  const token = generateJWTToken(user);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

const signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmed: req.body.passwordConfirmed,
    role: req.body.role,
  });
  sendToken(newUser, 201, res);
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
  sendToken(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
  let token;

  //get the token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError("You're not logged in! Please login to get access.", 401)
    );
  }

  //verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  //check if the user changed the password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again.', 401)
    );
  }

  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There's no user with this email address!", 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/reset-password/${resetToken}`;

  const message = `Forgot password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you don't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      message: message,
      subject: 'Your password rest token, valid for (10) mins',
    });

    res.status(200).json({
      status: 'Success',
      message: 'Password reset url send to your email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There's an error sending an email! Please try again later!"
      ),
      500
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  //Get uer base on password reset token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //Check if the token is not expired, check if there's a user
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  //Update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  sendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  //If so, update password
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  await user.save();
  sendToken(user, 200, res);
});

module.exports = {
  signUp,
  logIn,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
