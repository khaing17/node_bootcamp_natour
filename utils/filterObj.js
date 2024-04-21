const filterObj = (bodyObj, ...allowedFields) => {
  const newObj = {};
  Object.keys(bodyObj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = bodyObj[el];
  });

  return newObj;
};

module.exports = filterObj;
