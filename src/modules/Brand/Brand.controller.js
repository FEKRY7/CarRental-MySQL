const BrandModel = require("../../../Database/models/Brand.model.js");
const cloudinary = require("../../utils/cloud.js");
const slugify = require("slugify");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllBrands = async (req, res, next) => {
  try {
    const GetAllBrands = await BrandModel.getBrand({});

    if (!GetAllBrands) {
      return First(res, "No Brand requests found", 404, http.FAIL);
    }

    return Second(res, ["Success", GetAllBrands], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetBrandById = async (req, res) => {
  const { id } = req.params; // Destructure the id from the request parameters

  try {
    // Find the Brand by ID
    const Brand = await BrandModel.findBrandById(id);

    if (!Brand) {
      return First(res, "This Brand does not exist", 404, http.FAIL); // Return 404 if Brand is not found
    }

    // Return the Brand if found
    return Second(res, ["Success", Brand], 200, http.SUCCESS);
  } catch (error) {
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const AddNewBrand = async (req, res, next) => {
  let { name, slug, image } = req.body;
  try {
    // Generate slug from brand name
    slug = slugify(name);

    // Check if brand already exists
    const checkBrandExisting = await BrandModel.getBrandByName({ name });
    if (checkBrandExisting) {
      return First(res, "This Brand already exists", 409, http.FAIL);
    }

    // Ensure an image file is uploaded
    if (!req.file) {
      return First(res, "Image file is required", 400, http.FAIL);
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: `RentACarTesting/Brand/${name}`,
    });
    image = uploadedImage.secure_url;

    // Create new brand
    const brand = await BrandModel.addNewbrand(name, slug, image);

    return Second(
      res,
      ["Brand created successfully", brand],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateBrand = async (req, res, next) => {
  const { id } = req.params;
  let { name, slug, image } = req.body;

  try {
    // Check if the brand exists
    const checkBrandExisting = await BrandModel.findBrandById(id);
    if (!checkBrandExisting) {
      return First(res, "This Brand does not exist", 404, http.FAIL);
    }

    // Check if brand name already exists (excluding the current brand)
    const checkBrandName = await BrandModel.getBrandByName({
      name,
      _id: { $ne: id },  // Exclude the current brand from the name check
    });
    if (checkBrandName) {
      return First(
        res,
        `Brand name "${name}" already exists`,
        409,
        http.FAIL
      );
    }

    // If name is provided, update slug based on the name
    if (name) {
      slug = slugify(name);
    }

    // If a new file is uploaded, replace the old image
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `RentACarTesting/Brand/${name || checkBrandExisting.name}`,
        }
      );

      // Delete the old image from Cloudinary using the secure_url
      if (checkBrandExisting.image) {
        const oldImageUrl = checkBrandExisting.image;

        // Extract public_id from secure_url
        const publicId = oldImageUrl
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0]; // Extract path before file extension

        await cloudinary.uploader.destroy(publicId);
      }

      // Assign the new image URL
      image = uploadedImage.secure_url;
    }

    // Update the brand
    const updatedBrand = await BrandModel.updateBrand(id, name, slug, image);
    if (!updatedBrand) {
      return First(res, "No Brand requests found", 404, http.FAIL);
    }

    return Second(
      res,
      ["Brand updated successfully", updatedBrand],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};



const DeleteBrand = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the document by ID
    const document = await BrandModel.findBrandById(id);
    if (!document) {
      return First(res, "This document does not exist", 404, http.FAIL);
    }

    // Note: Skipping image deletion from Cloudinary since we don't have public_id
    // However, you can log the URLs that would have been deleted
    if (document.image?.secure_url) {
      console.log(`Image to delete: ${document.image.secure_url}`);
    }

    // Delete the document from the database
    await BrandModel.deleteBrand(id);

    return Second(res, "Document deleted successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


// SearchBrand Controller Method
const SearchBrand = async (req, res, next) => {
  const { keyWord } = req.query;

  try {
    // Use the model method to search for Brand
    const searchResult = await BrandModel.searchBrand(keyWord);

    // If no Brand are found, return a 404 response
    if (searchResult.length === 0) {
      return First(res, "No Brand found", 404, http.FAIL);
    }

    // If Brand are found, return the search results
    return Second(res, ["Search results", searchResult], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

//http://localhost:3000/api/brand/search?keyWord=Car Suany Hondy

module.exports = {
  GetAllBrands,
  GetBrandById,
  SearchBrand,
  AddNewBrand,
  UpdateBrand,
  DeleteBrand,
};
