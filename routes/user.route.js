const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/user.controller');
const {
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/auth.controller');

/**
 * This routes are for authenticated user only
 */

router.use(protect);

router.route('/me').get(getMe, getUser);

router.route('/update-profile').patch(updateMe);
router.route('/delete-account').delete(deleteMe);
router.route('/update-password').patch(updatePassword);

/**
 * This routes are to use in administrate
 */
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
