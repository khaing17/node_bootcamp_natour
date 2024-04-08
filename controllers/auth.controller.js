const User = require('../model/user.model');
const catchAsync = require('../utils/catchAsync');
const signUp = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

module.exports = {
  signUp,
};
