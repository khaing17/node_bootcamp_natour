const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');

const createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

const getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    /**
     * To allow nested route with tour
     */
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const modelQuery = Model.find(filter);
    const features = new ApiFeatures(modelQuery, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc,
      },
    });
  });
};

const getOne = (Model, populateOptions = []) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (Array.isArray(populateOptions)) {
      populateOptions.forEach((option) => {
        query = query.populate(option);
      });
    } else {
      query = query.populate(populateOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

const deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

const updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
