const express = require('express');
const {
  getAllReviews,
  writeReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('../controllers/review.controller');
const { protect, restrictTo } = require('../controllers/auth.controller');
const router = express.Router({
  mergeParams: true,
});

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, writeReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
