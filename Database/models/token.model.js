const db = require('../dbConnection.js');

class TokenModule {
  // Function to create a new token
  static async createToken(token, user_id, isValied) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO token (token, user_id, isValied) VALUES (?, ?, ?)";

      // Execute the query
      db.query(query, [token, user_id, isValied], (error, result) => {
        if (error) {
          console.error("Error adding new token to the database:", error); // Log error for debugging
          return reject(new Error("Error inserting token data")); // Return a user-friendly error
        }

        // Resolve the result on success
        resolve(result);
      });
    });
  }

  static async findUserByToken(token) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM token WHERE token = ? AND isValied = 1"; // Assuming isValied should always be true
      db.query(query, [token], (error, result) => {
        if (error) {
          reject(error); // Reject the promise if there's an error
        } else if (result.length === 0) {
          resolve(null); // Resolve null if no user is found
        } else {
          resolve(result[0]); // Return the first result as the found user
        }
      });
    });
  }
  
}

module.exports = TokenModule;
