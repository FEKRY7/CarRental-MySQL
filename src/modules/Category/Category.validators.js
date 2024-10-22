const joi = require("joi");
const {
  isValidId,
} = require("../../middleware/validation.middleware.js");

const addNewCategory = joi
  .object({
    name: joi.string().required(),
    description: joi.string().required()
  })
  .required();

const updateCategory = joi
  .object({
    name: joi.string(),
    description: joi.string(),
    id: joi.string().custom(isValidId).required(),
  })
  .required();

const deleteCategory = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

const getCategoryById = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

module.exports = {
  addNewCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
