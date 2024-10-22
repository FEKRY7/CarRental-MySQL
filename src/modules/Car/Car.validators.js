const joi = require("joi");
const {
  isValidId,
} = require("../../middleware/validation.middleware.js");

const addNewCar = joi
  .object({
    name: joi.string().required(),
    color: joi.string().required(),
    modelYear: joi.number().required(),
    seater: joi.number().required(),
    powerHourse: joi.string().required(),
    categoryId: joi.number().custom(isValidId).required(),
    brandId: joi.number().custom(isValidId).required(),
    KilometersIncluded: joi.number().required(), 
    rentalCost: joi.number().required(), 
  })
  .required();

const updateCar = joi
  .object({
    name: joi.string(),
    color: joi.string(),
    modelYear: joi.number(),
    seater: joi.number(),
    powerHourse: joi.string(),
    categoryId: joi.string().custom(isValidId), 
    brandId: joi.string().custom(isValidId), 
    KilometersIncluded: joi.number(), 
    rentalCost: joi.number(), 
    id: joi.string().custom(isValidId).required(),
  })
  .required();

const deleteCar = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

const getCarById = joi
  .object({
    id: joi.string().custom(isValidId).required(),
  })
  .required();

module.exports = {
  addNewCar,
  updateCar,
  deleteCar,
  getCarById,
};
