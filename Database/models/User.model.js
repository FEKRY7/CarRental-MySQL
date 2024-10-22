const db = require('../dbConnection.js');

class UserModule {

static async addNewUser(userName, password, role) {
    const query = "INSERT INTO user (userName, password, role) VALUES (?, ?, ?)";
  
    return new Promise((resolve, reject) => {
      // Execute the query
      db.query(query, [userName, password, role], (error, result) => {
        if (error) {
          console.error("Error adding new user to the database:", error); // Log error for debugging
          return reject(new Error("Error inserting user data")); // Return a user-friendly error
        }
  
        // Resolve the result on success
        resolve(result);
      });
    });
  }
  

static async getUserByUserName(userName) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE userName = ?";
  
      db.query(query, [userName], (error, result) => {
        if (error) {
          console.error('Database query error:', error);
          return reject(error); // Reject the promise with the error
        }
        
        if (result.length === 0) {
          return resolve(null); // No user found, resolve with null
        }
  
        resolve(result[0]); // User found, resolve with the first result
      });
    });
  }
  

  static async isLoggedIn(userId, isLoggedIn) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE user SET isLoggedIn = ? WHERE id = ?";

      // Execute the query
      db.query(query, [isLoggedIn, userId], (error, result) => {
        if (error) {
          console.error("Error updating isLoggedIn status in the database:", error); // Log error for debugging
          return reject(new Error("Error updating user isLoggedIn status")); // Return a user-friendly error
        }

        if (result.affectedRows === 0) {
          return reject(new Error("User not found")); // If no rows are affected, it means the user ID doesn't exist
        }

        // Resolve the result on success
        resolve(result);
      });
    });
  }

  static async UpdatePassword(userId, password) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE user SET password = ? WHERE id = ?";

      // Execute the query
      db.query(query, [password, userId], (error, result) => {
        if (error) {
          console.error("Error updating password status in the database:", error); // Log error for debugging
          return reject(new Error("Error updating user password status")); // Return a user-friendly error
        }

        if (result.affectedRows === 0) {
          return reject(new Error("User not found")); // If no rows are affected, it means the user ID doesn't exist
        }

        // Resolve the result on success
        resolve(result);
      });
    });
  }

  static async findUserById(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE id = ?";
      db.query(query, [userId], (error, result) => {
        if (error) {
          reject(error); // Rejecting the promise if there's an error
        } else if (result.length === 0) {
          resolve(null); // Resolve null if no user found
        } else {
          resolve(result[0]); // Return the first result as the found user
        }
      });
    });
  }

}

module.exports = UserModule;


