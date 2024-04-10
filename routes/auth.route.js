const express = require('express');
const { signUp } = require('../controllers/auth.controller');
const router = express.Router();

router.route('/sign-up').post(signUp);

module.exports = router;
