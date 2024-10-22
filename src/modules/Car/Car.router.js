const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");
const { fileUpload, allowedFiles } = require("../../utils/fileUpload.js");

const {
  addNewCar,
  updateCar,
  deleteCar,
  getCarById,
} = require("./Car.validators.js");

const {
  GetAllCars,
  GetCarById,
  AddNewCar,
  UpdateCarById,
  DeleteCarById,
  OrderByDate,
  OrderByPrice,
  OrderByPriceDesc,
} = require("./Car.controller.js");

router
  .route("/")
  .get(GetAllCars)
  .post(
    isAuthenticated,  // Ensure user is authenticated
    isAuthorized("Admin", "SuperAdmin"),  // Only allow Admin and SuperAdmin roles
    fileUpload(allowedFiles.image).fields([
      {
        name: "image",  // The main car image
        maxCount: 2,    // Only 1 image allowed for the main car image
      },
      {
        name: "sliderImages",  // Field for slider images
        maxCount: 3,  // Allow up to 10 slider images
      },
    ]),
    validation(addNewCar),  // Validation middleware for request body
    AddNewCar  // Controller method to add the car
  );

router
  .route("/:id")
  .delete(
    isAuthenticated,
    isAuthorized("SuperAdmin"),
    validation(deleteCar),
    DeleteCarById
  )
  .put(
    isAuthenticated,
    isAuthorized("Admin", "SuperAdmin"),
    fileUpload(allowedFiles.image).fields([
      {
        name: "image",
        maxCount: "1",
      },
      { name: "sliderImages", maxCount: "3" },
    ]),
    validation(updateCar),
    UpdateCarById
  )
  .get(validation(getCarById), GetCarById);
  
router.get("/orderby=date", OrderByDate);
router.get("/orderby=price", OrderByPrice);
router.get("/orderby=price-desc", OrderByPriceDesc);

module.exports = router;