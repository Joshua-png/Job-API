const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err);
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Server Internal Error",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  if (err.name === "ValidationError") {
    customError.statusCode = 400;
    customError.msg = Object.values(err.errors)
      .map((error) => error.message)
      .join(",");
  }

  if (err.code && err.code === 11000) {
    (customError.statusCode = StatusCodes.BAD_REQUEST),
      (customError.msg = `Duplicate value enter for ${Object.keys(
        err.keyValue
      )} field. Please Enter another value`);
  }

  if (err.name === "CastError") {
    customError.statusCode = 400;
    customError.msg = `No item with id: ${err.value[err.path]} found`;
  }
  // return res.status(customError.statusCode).json(err);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
