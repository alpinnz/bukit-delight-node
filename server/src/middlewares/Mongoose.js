const mongoose = require("mongoose");

exports.CheckObjectId = async (req, res, next) => {
  try {
    const validate = mongoose.Types.ObjectId.isValid(req.params._id);
    if (validate) {
      return next();
    } else {
      return next(err("Id Error", 404));
    }
  } catch (error) {
    return next(err(error, 404));
  }
};
