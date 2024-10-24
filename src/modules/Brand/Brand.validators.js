const joi = require("joi");
const {
  isValidId,
} = require("../../middleware/validation.middleware.js");

const addNewBrand = joi
  .object({
    name: joi.string().required(),
  })
  .required();

const updateBrand = joi
  .object({
    name: joi.string(),
    id: joi.string().custom(isValidId).required(),
  })
  .required();

const deleteBrand = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

const getBrandById = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

module.exports = {
  addNewBrand,
  updateBrand,
  deleteBrand,
  getBrandById,
};
