const Review = require('../model/review.model');
const factory = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.author = req.user.id;
  next();
};

const getAllReviews = factory.getAll(Review);

const getReview = factory.getOne(Review);

const writeReview = factory.createOne(Review);

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

module.exports = {
  getAllReviews,
  writeReview,
  deleteReview,
  updateReview,
  getReview,
  setTourUserIds,
};
