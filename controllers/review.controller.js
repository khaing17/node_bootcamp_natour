const Review = require('../model/review.model');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const getAllReviews = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const review = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    result: review.length,
    data: {
      review,
    },
  });
});

const writeReview = catchAsync(async (req, res) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.author = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

module.exports = {
  getAllReviews,
  writeReview,
  deleteReview,
  updateReview,
};
