const db = require('../dbConnection.js');

class CarModel {
  static async getCar(filter = {}, pagination = {}) {
    return new Promise((resolve, reject) => {
      // Build the SQL query dynamically based on the filter and pagination
      let query = "SELECT * FROM car";
      let params = [];
      
      // Apply filter for category ID if provided
      if (filter.categoryId) {
        query += " WHERE categoryId = ?";
        params.push(filter.categoryId);
      }
  
      // Apply pagination if specified
      if (pagination.limit && pagination.offset) {
        query += " LIMIT ? OFFSET ?";
        params.push(pagination.limit, pagination.offset);
      }
  
      // Execute the query
      db.query(query, params, (error, result) => {
        if (error) {
          reject(error); // Reject the promise if there's an error
        } else {
          resolve(result); // Resolve the promise if the query is successful
        }
      });
    });
  }

  static async addNewCar(
    name, slug, color, modelYear,
    seater, powerHourse, KilometersIncluded,
    rentalCost, carSliderImages, carCardImage,
    categoryId, brandId
  ) {
    const query = `INSERT INTO car (
      name, slug, color, modelYear, seater, powerHourse, KilometersIncluded,
      rentalCost, carSliderImages, carCardImage, categoryId, brandId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    return new Promise((resolve, reject) => {
      // Convert carSliderImages to JSON string (in case it's an array)
      const carSliderImagesString = JSON.stringify(carSliderImages);
  
      db.query(query, [
        name, slug, color, modelYear,
        seater, powerHourse, KilometersIncluded,
        rentalCost, carSliderImagesString, carCardImage,
        categoryId, brandId
      ], (error, result) => {
        if (error) {
          console.error("Error adding new car to the database:", error); // Log error for debugging
          return reject(new Error("Error inserting car data")); // Return user-friendly error message
        }
        resolve(result); // Resolve with the result on successful insertion
      });
    });
  }  

  // Model method to find a car by ID
  static async findCarById(carId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM car WHERE id = ?"; // Use correct table name 'car'

      db.query(query, [carId], (error, result) => {
        if (error) {
          console.error("Error finding car by ID:", error); // Log the error for debugging
          return reject(new Error("Error finding car")); // Reject the promise with an error message
        } else if (result.length === 0) {
          resolve(null); // Resolve with null if no car is found
        } else {
          resolve(result[0]); // Resolve with the first result (the car)
        }
      });
    });
  }


  static async updateCar(
    carId, { name, slug, color, modelYear, seater, powerHourse, KilometersIncluded, rentalCost, carSliderImages, carCardImage, categoryId, brandId }
  ) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE car 
        SET 
          name = ?, slug = ?, color = ?, modelYear = ?, 
          seater = ?, powerHourse = ?, KilometersIncluded = ?,
          rentalCost = ?, carSliderImages = ?, carCardImage = ?, 
          categoryId = ?, brandId = ? 
        WHERE id = ?`;
  
      // Ensure carSliderImages is a valid JSON string (handle null or undefined)
      const carSliderImagesString = carSliderImages ? JSON.stringify(carSliderImages) : '[]';
  
      // Execute the query with sanitized inputs
      db.query(query, [
        name, slug, color, modelYear, seater, powerHourse,
        KilometersIncluded, rentalCost, carSliderImagesString,
        carCardImage, categoryId, brandId, carId
      ], (error, result) => {
        if (error) {
          console.error("Error updating car in the database:", error);
          return reject(new Error("Error updating car data"));
        }
  
        if (result.affectedRows === 0) {
          return reject(new Error("Car not found"));
        }
  
        // Resolve the result on success
        resolve(result);
      });
    });
  }
  
  static async deleteCar(carId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM car WHERE id = ?";
      db.query(query, [carId], (error, result) => {
        if (error) {
          reject(error); // Rejecting the promise if there's an error
        } else {
          resolve(result); // Resolving the promise if the query is successful
        }
      });
    });
  }

  static async getOrderByDate(order = 'ASC') {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM car ORDER BY createdAt ${order}`;
      
      db.query(query, [], (error, result) => {
        if (error) {
          console.error("Error retrieving cars from the database:", error);
          return reject(new Error("Error fetching cars"));
        }
  
        resolve(result); // Resolve the result on success
      });
    });
  }
  
  static async getOrderByPrice(order = 'ASC') {
    return new Promise((resolve, reject) => {
      // Query to select all cars and order by rentalCost (price)
      const query = `SELECT * FROM car ORDER BY rentalCost ${order}`;
  
      db.query(query, [], (error, result) => {
        if (error) {
          console.error("Error retrieving cars by price:", error);
          return reject(new Error("Error fetching cars by price"));
        }
  
        resolve(result); // Resolving the result if the query is successful
      });
    });
  }

  static async getOrderByPriceDesc() {
    return new Promise((resolve, reject) => {
      // SQL query to select all cars and order by rentalCost in descending order
      const query = "SELECT * FROM car ORDER BY rentalCost DESC";
  
      db.query(query, [], (error, result) => {
        if (error) {
          console.error("Error retrieving cars by price in descending order:", error);
          return reject(new Error("Error fetching cars by price"));
        }
  
        resolve(result); // Resolving the result if the query is successful
      });
    });
  }
  
}

module.exports = CarModel;
