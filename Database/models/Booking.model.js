const db = require('../dbConnection.js');

class BookingModel {
  static async getBooking() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM booking", [], (error, result) => {
        if (error) {
          reject(error); // Rejecting the promise if there's an error
        } else {
          resolve(result); // Resolving the promise if the query is successful
        }
      });
    });
  }

  static async addNewBooking(fullName, mobilePhone, specialRequest, rentalStartDate, rentalEndDate, carId) {
    const query = "INSERT INTO booking (fullName, mobilePhone, specialRequest, rentalStartDate, rentalEndDate, carId) VALUES (? ,? ,? ,? ,? ,?)";
  
    return new Promise((resolve, reject) => {
      db.query(query, [fullName, mobilePhone, specialRequest, rentalStartDate, rentalEndDate, carId], (error, result) => {
        if (error) {
          console.error("Error adding new booking to the database:", error); // Log error for debugging
          return reject(new Error("Error inserting booking data")); // Return user-friendly error message
        }
        resolve(result); // Resolve with the result on successful insertion
      });
    });
  }


  // Model method to find a booking by ID
  static async findBookingById(bookingId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM booking WHERE id = ?"; // Use correct table name 'booking'

      db.query(query, [bookingId], (error, result) => {
        if (error) {
          console.error("Error finding booking by ID:", error); // Log the error for debugging
          return reject(new Error("Error finding booking")); // Reject the promise with an error message
        } else if (result.length === 0) {
          resolve(null); // Resolve with null if no booking is found
        } else {
          resolve(result[0]); // Resolve with the first result (the booking)
        }
      });
    });
  }
 
  static async updateBooking(bookingId, status) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE booking SET status = ? WHERE id = ?";
  
      // Execute the query with the correct parameter order
      db.query(query, [status, bookingId], (error, result) => {
        if (error) {
          console.error("Error updating booking in the database:", error);
          return reject(new Error("Error updating booking data"));
        }
  
        if (result.affectedRows === 0) {
          return reject(new Error("booking not found"));
        }
  
        // Resolve the result on success
        resolve(result);
      });
    });
  }
  

  static async deleteBooking(bookingId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM booking WHERE id = ?";
      db.query(query, [bookingId], (error, result) => {
        if (error) {
          reject(error); // Rejecting the promise if there's an error
        } else {
          resolve(result); // Resolving the promise if the query is successful
        }
      });
    });
  }
  
}

module.exports = BookingModel;

