const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/user.controller');
const {
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/auth.controller');

/**
 * This routes are for authenticated user only
 */
router.route('/update-profile').patch(protect, updateMe);
router.route('/delete-account').delete(protect, deleteMe);
router.route('/update-password').patch(protect, updatePassword);

/**
 * This routes are to use in administrate
 */
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
