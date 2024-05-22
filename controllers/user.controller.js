const User = require('../model/user.model');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const factory = require('./handlerFactory');

//this is to use in administrate

// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };
const getAllUsers = factory.getAll(User);

const getUser = factory.getOne(User);
//do not update password with this controller
const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

//////////////////////////////////////

/**
 * This is for the authenticated user only
 */

//this is for updating the user itself
const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for updating password!', 400));
  }

  const filterField = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterField, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'Update your profile successfully!',
    data: {
      user: updatedUser,
    },
  });
});

//this is for deleting the user itself
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
