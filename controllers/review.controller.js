const Review = require('../model/review.model');
const Tour = require('../model/tour.model');
const catchAsync = require('../utils/catchAsync');

const getAllReviews = catchAsync(async (req, res) => {
  const review = await Review.find();

  res.status(200).json({
    status: 'success',
    result: review.length,
    data: {
      review,
    },
  });
});

const writeReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

module.exports = {
  getAllReviews,
  writeReview,
};
