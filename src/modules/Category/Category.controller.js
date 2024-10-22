const CategoryModel = require("../../../Database/models/Category.model.js");
const cloudinary = require("../../utils/cloud.js");
const slugify = require("slugify");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllCategories = async (req, res, next) => {
  try {
    const getAllCategories = await CategoryModel.getCategorys({});

    if (!getAllCategories) {
      return First(res, "No Categorie requests found", 404, http.FAIL);
    }

    return Second(res, ["Done", getAllCategories], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Controller method to handle the GetCategoryById request
const GetCategoryById = async (req, res) => {
  const { id } = req.params; // Destructure the id from the request parameters

  try {
    // Find the category by ID
    const category = await CategoryModel.findcategoryById(id);
    
    if (!category) {
      return First(res, "This category does not exist", 404, http.FAIL); // Return 404 if category is not found
    }

    // Return the category if found
    return Second(res, ["Success", category], 200, http.SUCCESS);
  } catch (error) {
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Controller method to handle adding a new category
const AddNewCategory = async (req, res, next) => {
  try {
    // Generate slug
    req.body.slug = slugify(req.body.name);

    // Check if category already exists
    const checkCategoryExisting = await CategoryModel.getCategorysByName({ name: req.body.name });
    if (checkCategoryExisting) {
      return First(res, "This category already exists", 409, http.FAIL);
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: `RentACarTesting/Category/${req.body.name}`,
    });

    // Attach Cloudinary image info to request body
    req.body.image = uploadedImage.secure_url

    // Create new category
    const category = await CategoryModel.addNewCategory(
      req.body.name, 
      req.body.description,
      req.body.slug, 
      req.body.image
    ); 
 
    return Second(res, ["Done", category], 201, http.SUCCESS);
  } catch (error) {
    console.error("Error in AddNewCategory:", error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the category exists
    const checkCategoryExisting = await CategoryModel.findcategoryById(id);
    if (!checkCategoryExisting) {
      return First(res, "This Category does not exist", 404, http.FAIL);
    }
 
    // Check if the category name already exists for another category
    const checkCategoryName = await CategoryModel.getCategorysByName({
      name: req.body.name,
      id: { $ne: id }, // Check if any other category has the same name
    });
    if (checkCategoryName) {
      return First(res, "This Category name already exists", 409, http.FAIL);
    }

    // If updating the image
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `RentACarTesting/Category/${req.body.name || checkCategoryExisting.name}`,
        }
      );

      // Assign the new image URL to req.body.image
      req.body.image = uploadedImage.secure_url;
    }

    // If no slug is provided, generate one from the name
    req.body.slug = req.body.slug || slugify(req.body.name || checkCategoryExisting.name);

    // Update the category
    const updatedCategory = await CategoryModel.updateCategory(
      id, // Pass the category ID
      req.body.name, 
      req.body.description,
      req.body.slug, 
      req.body.image
    );

    return Second(res, ["Category updated successfully", updatedCategory], 200, http.SUCCESS);
  } catch (error) {
    console.error("Error updating category:", error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the document by ID
    const document = await CategoryModel.findcategoryById(id);
    if (!document) {
      return First(res, "This document does not exist", 404, http.FAIL);
    }

    // Note: Skipping image deletion from Cloudinary since we don't have public_id
    // However, you can log the URLs that would have been deleted
    if (document.image?.secure_url) {
      console.log(`Image to delete: ${document.image.secure_url}`);
    }

    // Delete the document from the database
    await CategoryModel.deleteCategory(id);

    return Second(res, "Document deleted successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

// Category.controller.js

const SearchCategory = async (req, res, next) => {
  const { keyWord } = req.query;

  try {
    // Use the model method to search for categories
    const searchResult = await CategoryModel.searchCategories(keyWord);

    // If no categories are found, return a 404 response
    if (searchResult.length === 0) {
      return First(res, "No categories found", 404, http.FAIL);
    }

    // If categories are found, return the search results
    return Second(res, ["Search results", searchResult], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//like
// http://localhost:3000/api/category/search?keyWord=Lego%205%20Pro
//http://localhost:3000/api/category/search?keyWord=Labtob%20Geming

module.exports = {
  GetAllCategories,
  AddNewCategory,
  GetCategoryById,
  SearchCategory,
  UpdateCategory,
  DeleteCategory,
};