const db = require('../dbConnection.js');

class BrandModel {
  static async getBrand() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM brand", [], (error, result) => {
        if (error) {
          reject(error); // Rejecting the promise if there's an error
        } else {
          resolve(result); // Resolving the promise if the query is successful
        }
      });
    });
  }

  static async addNewbrand(name, slug, image) {
    const query = "INSERT INTO brand (name, slug, image) VALUES (?, ?, ?)";

    return new Promise((resolve, reject) => {
      db.query(query, [name, slug, image], (error, result) => {
        if (error) {
          console.error("Error adding new brand to the database:", error); // Log error for debugging
          return reject(new Error("Error inserting brand data")); // Return user-friendly error message
        }
        resolve(result); // Resolve with the result on successful insertion
      });
    });
  }


  // Method to check if brand exists
  static async getBrandByName({ name }) {
    const query = "SELECT * FROM brand WHERE name = ?"; // Correct table name

    return new Promise((resolve, reject) => {
      db.query(query, [name], (error, result) => {
        if (error) {
          console.error("Error retrieving brand by name:", error);
          return reject(new Error("Error fetching brand data"));
        }
        resolve(result.length > 0 ? result[0] : null);
      });
    });
  }

  // Model method to find a brand by ID
  static async findBrandById(brandId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM brand WHERE id = ?"; // Use correct table name 'brand'

      db.query(query, [brandId], (error, result) => {
        if (error) {
          console.error("Error finding brand by ID:", error); // Log the error for debugging
          return reject(new Error("Error finding brand")); // Reject the promise with an error message
        } else if (result.length === 0) {
          resolve(null); // Resolve with null if no brand is found
        } else {
          resolve(result[0]); // Resolve with the first result (the brand)
        }
      });
    });
  }
 
  static async updateBrand(brandId, name, slug, image) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE brand SET name = ?, slug = ?, image = ? WHERE id = ?";
  
      // Execute the query with the correct parameter order
      db.query(query, [name, slug, image, brandId], (error, result) => {
        if (error) {
          console.error("Error updating brand in the database:", error);
          return reject(new Error("Error updating brand data"));
        }
  
        if (result.affectedRows === 0) {
          return reject(new Error("Brand not found"));
        }
  
        // Resolve the result on success
        resolve(result);
      });
    });
  }
  

  static async deleteBrand(brandId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM brand WHERE id = ?";
      db.query(query, [brandId], (error, result) => {
        if (error) {
          reject(error); // Rejecting the promise if there's an error
        } else {
          resolve(result); // Resolving the promise if the query is successful
        }
      });
    });
  }
  
  static async searchBrand(keyWord) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM brand 
        WHERE name LIKE ?
      `;
      
      const searchKeyword = `%${keyWord}%`; // Prepare the keyword for SQL LIKE operator
  
      // Execute the query with the prepared search keyword
      db.query(query, [searchKeyword], (error, result) => {
        if (error) {
          console.error("Error searching Brand:", error);
          return reject(new Error("Error searching Brand"));
        }
        resolve(result); // Resolve with the search results
      });
    });
  }
  
}

module.exports = BrandModel;

