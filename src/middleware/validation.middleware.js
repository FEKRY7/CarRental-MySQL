const http = require("../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../utils/httperespons.js");


const isValidId = (value, helper) => {
  // Ensure the value is a positive integer
  if (Number.isInteger(Number(value)) && Number(value) > 0) {
    return true;
  }
  return helper.message("Invalid integer ID");
};

const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(data, { abortEarly: false });

    if (validationResult.error) {
      const errorMessage = validationResult.error.details.map((obj) => {
        return obj.message;
      });
      return First(res, errorMessage, 404, http.FAIL);
    }

    return next();
  };
};

module.exports = {
  isValidId,
  validation,
};
