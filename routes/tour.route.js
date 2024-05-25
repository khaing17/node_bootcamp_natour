const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlans,
} = require('../controllers/tour.controller');

const { protect, restrictTo } = require('../controllers/auth.controller');

const reviewRouter = require('./review.route');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// Tour Routes
router.route('/tours-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlans);

router
  .route('/top-5-cheap')
  .get(protect, restrictTo('admin'), aliasTopTours, getAllTours);

//Basic crud
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

/**
 * This routes are related with reviews
 */
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), writeReview);

module.exports = router;
