const joi = require("joi");
const {
  isValidId,
} = require("../../middleware/validation.middleware.js");

const createBookingRequest = joi
  .object({
    carId: joi.number().custom(isValidId).required(),
    fullName: joi.string().required(),
    mobilePhone: joi.string().required(),
    specialRequest: joi.string(),
    rentalStartDate: joi
      .date()
      .min(Date.now())
      .message('"date" cannot be earlier than today'),
    rentalEndDate: joi.date().min(Date.now()).message("Enter Invaild Date"),
  })
  .required();

const changeBookingRequestStatus = joi
  .object({
    status: joi.string(),
    id: joi.string().custom(isValidId).required(),
  })
  .required();

const deleteBookingRequest = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

const getBookingById = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

module.exports = {
  createBookingRequest,
  changeBookingRequestStatus,
  deleteBookingRequest,
  getBookingById,
};
