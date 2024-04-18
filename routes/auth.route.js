const express = require('express');
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const router = express.Router();

router.route('/sign-up').post(signUp);
router.route('/log-in').post(logIn);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);

module.exports = router;
