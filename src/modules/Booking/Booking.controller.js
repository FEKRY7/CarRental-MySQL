const BookingModel = require("../../../Database/models/Booking.model.js");
const CarModel = require("../../../Database/models/Car.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllBookingRequests = async (req, res, next) => {
  try {
    // Retrieve all booking requests
    const GetAllBooking = await BookingModel.getBooking();

    // If no booking GetAllBooking are found, return a 404 response
    if (!GetAllBooking) {
      return First(res, "No booking requests found", 404, http.FAIL);
    }

    // Return the booking requests if found
    return Second(res, ["Done", GetAllBooking], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetBookingById = async (req, res) => {
  const { id } = req.params; // Destructure the id from the request parameters

  try {
    // Find the Booking by ID
    const Booking = await BookingModel.findBookingById(id);

    if (!Booking) {
      return First(res, "This Booking does not exist", 404, http.FAIL); // Return 404 if Booking is not found
    }

    // Return the Booking if found
    return Second(res, ["Success", Booking], 200, http.SUCCESS);
  } catch (error) {
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const CreateBookingRequest = async (req, res, next) => {
  try {
    const {
      carId,
      fullName,
      mobilePhone,
      specialRequest,
      rentalStartDate,
      rentalEndDate,
    } = req.body;

    // Check if car exists
    const isExistCar = await CarModel.findCarById(carId);
    if (!isExistCar)
      return First(res, "Cannot find this car, check the ID", 404, http.FAIL);

    // Validate that rentalEndDate is after rentalStartDate
    if (new Date(rentalEndDate) < new Date(rentalStartDate)) {
      return First(res, "rentalEndDate cannot be before rentalStartDate", 400, http.FAIL);
    }

    // Create a new booking
    const bookingRequest = await BookingModel.addNewBooking(
      fullName,
      mobilePhone,
      specialRequest,
      rentalStartDate,
      rentalEndDate,
      carId
    );

    return Second(
      res,
      ["Request sent. Once we receive it, we will contact you", bookingRequest],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteBookingRequest = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the document by ID
    const document = await BookingModel.findBookingById(id);
    if (!document) {
      return First(res, "This document does not exist", 404, http.FAIL);
    }

    // Delete the document from the database
    await BookingModel.deleteBooking(id);

    return Second(res, "Document deleted successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const ChangeBookingRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const checkRequest = await BookingModel.updateBooking(id,status);
    if (!checkRequest) {
      return First(res, "Invalid request", 404, http.FAIL);
    }

    return Second(
      res,
      ["Request updated successfully", checkRequest],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  CreateBookingRequest,
  GetAllBookingRequests,
  ChangeBookingRequestStatus,
  DeleteBookingRequest,
  GetBookingById,
};
