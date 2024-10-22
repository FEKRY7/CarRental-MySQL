const db = require('../dbConnection.js');

class CategoryModule {
  static async getCategorys() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM category", [], (error, result) => {
        if (error) {
          reject(error); // Rejecting the promise if there's an error
        } else {
          resolve(result); // Resolving the promise if the query is successful
        }
      });
    });
  }

  static async addNewCategory(name, description, slug, image) {
    const query = "INSERT INTO category (name, description, slug, image) VALUES (?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
      db.query(query, [name, description, slug, image], (error, result) => {
        if (error) {
          console.error("Error adding new category to the database:", error); // Log error for debugging
          return reject(new Error("Error inserting category data")); // Return user-friendly error message
        }
        resolve(result); // Resolve with the result on successful insertion
      });
    });
  }


  // Method to check if category exists
  static async getCategorysByName({ name }) {
    const query = "SELECT * FROM category WHERE name = ?"; // Correct table name

    return new Promise((resolve, reject) => {
      db.query(query, [name], (error, result) => {
        if (error) {
          console.error("Error retrieving category by name:", error);
          return reject(new Error("Error fetching category data"));
        }
        resolve(result.length > 0 ? result[0] : null);
      });
    });
  }

  // Model method to find a category by ID
  static async findcategoryById(categoryId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM category WHERE id = ?"; // Use correct table name 'category'

      db.query(query, [categoryId], (error, result) => {
        if (error) {
          console.error("Error finding category by ID:", error); // Log the error for debugging
          return reject(new Error("Error finding category")); // Reject the promise with an error message
        } else if (result.length === 0) {
          resolve(null); // Resolve with null if no category is found
        } else {
          resolve(result[0]); // Resolve with the first result (the category)
        }
      });
    });
  }

  static async updateCategory(categoryId, name, description, slug, image) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE category SET name = ?, description = ?, slug = ?, image = ? WHERE id = ?";
  
      // Execute the query
      db.query(query, [name, description, slug, image, categoryId], (error, result) => {
        if (error) {
          console.error("Error updating category in the database:", error); // Log error for debugging
          return reject(new Error("Error updating category data")); // Return a user-friendly error
        }
  
        if (result.affectedRows === 0) {
          return reject(new Error("Category not found")); // If no rows are affected, the category ID doesn't exist
        }
  
        // Resolve the result on success
        resolve(result);
      });
    });
  }

  static async deleteCategory(categoryId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM category WHERE id = ?";
      db.query(query, [categoryId], (error, result) => {
        if (error) {
          reject(error); // Rejecting the promise if there's an error
        } else {
          resolve(result); // Resolving the promise if the query is successful
        }
      });
    });
  }
  
  static async searchCategories(keyWord) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM category 
        WHERE name LIKE ? OR description LIKE ?
      `;
      
      const searchKeyword = `%${keyWord}%`; // Prepare the keyword for SQL LIKE operator
      
      db.query(query, [searchKeyword, searchKeyword], (error, result) => {
        if (error) {
          console.error("Error searching categories:", error);
          return reject(new Error("Error searching categories"));
        }
        resolve(result); // Resolve with the search results
      });
    });
  }
  
}

module.exports = CategoryModule;

