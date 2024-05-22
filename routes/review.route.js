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

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, writeReview);

router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);
// router
//   .route('/:id')
//   .get(getRev)
//   .patch(updateTour)
//   .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
