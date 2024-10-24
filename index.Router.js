const express = require("express");

const userRouter = require("./src/modules/auth/auth.router.js");
const categoryRouter = require("./src/modules/Category/Category.router.js");
const brandRouter = require("./src/modules/Brand/Brand.router.js");
const carRouter = require("./src/modules/Car/Car.router.js");
const bookingRouter = require("./src/modules/Booking/Booking.router.js");


const AppRouter = (app) => {

  //convert Buffer Data
  // Middleware to parse JSON
  app.use(express.json());
 
  // Routes
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/car", carRouter);
  app.use("/api/booking", bookingRouter);

  // 404 route
  app.use("*", (req, res) => {
    res.status(404).json({ Msg: "I Can't Found" });
  });
};

module.exports = AppRouter;