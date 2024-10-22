const BrandModel = require("../../../Database/models/Brand.model.js");
const CarModel = require("../../../Database/models/Car.model.js");
const CategoryModel = require("../../../Database/models/Category.model.js");
const cloudinary = require("../../utils/cloud.js");
const slugify = require("slugify");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const GetAllCars = async (req, res, next) => {
  try {
    const filter = {};
    const pagination = {
      limit: parseInt(req.query.limit) || 2, // Default limit
      offset: parseInt(req.query.page) || 0 // Default offset
    };

    // Filter by category ID if provided
    if (req.params.id) {
      filter.categoryId = req.params.id;
    }

    // Retrieve cars based on the applied features
    const cars = await CarModel.getCar(filter, pagination);

    if (cars.length === 0) {
      return First(res, "No cars found", 404, http.FAIL);
    }

    // If cars are found, return them in the response
    return Second(res, ["Done", cars], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetCarById = async (req, res) => {
  const { id } = req.params; // Destructure the id from the request parameters

  try {
    // Find the car by ID
    const car = await CarModel.findCarById(id);

    if (!car) {
      return First(res, "This car does not exist", 404, http.FAIL); // Return 404 if car is not found
    }

    // Return the car if found
    return Second(res, ["Success", car], 200, http.SUCCESS);
  } catch (error) {
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const AddNewCar = async (req, res, next) => {
  try {
    let {
      name,
      color,
      modelYear,
      seater,
      powerHourse,
      KilometersIncluded,
      rentalCost,
      categoryId,
      brandId,
    } = req.body;

    const slug = slugify(name); // Generate slug from car name

    // Check if category exists
    const isExistCategory = await CategoryModel.findcategoryById(categoryId);
    if (!isExistCategory) {
      return First(res, "Cannot Find This Category", 404, http.FAIL);
    }

    // Check if brand exists
    const isExistBrand = await BrandModel.findBrandById(brandId);
    if (!isExistBrand) {
      return First(res, "Cannot Find This Brand", 404, http.FAIL);
    }

    // Validate and upload the main car image
    if (!req.files || !req.files.image || req.files.image.length === 0) {
      return First(res, "Main Image is Required", 400, http.FAIL);
    }

    const uploadedCardImage = await cloudinary.uploader.upload(
      req.files.image[0].path, // Access first image for the card image
      { folder: `RentACarTesting/Car/${slug}-${color}/mainImage` }
    );
    const carCardImage = uploadedCardImage.secure_url;

    // Validate and upload the slider images
    let carSliderImages = [];
    if (req.files.sliderImages && req.files.sliderImages.length > 0) {
      // Upload multiple slider images
      for (const image of req.files.sliderImages) {
        const uploadedSliderImage = await cloudinary.uploader.upload(
          image.path,
          { folder: `RentACarTesting/Car/${slug}-${color}/sliderImages` }
        );
        carSliderImages.push(uploadedSliderImage.secure_url);
      }
    }

    // Add the new car to the database
    const car = await CarModel.addNewCar(
      name,
      slug,
      color,
      modelYear,
      seater,
      powerHourse,
      KilometersIncluded,
      rentalCost,
      carSliderImages, // Store the array directly
      carCardImage,
      categoryId,
      brandId
    );

    return Second(res, ["Car added successfully", car], 200, http.SUCCESS);
  } catch (error) {
    console.error("Error adding car:", error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const UpdateCarById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the car exists
    const isCarExist = await CarModel.findCarById(id);
    if (!isCarExist) return First(res, "Not Found", 404, http.FAIL);

    // Validate category
    if (req.body?.categoryId) {
      const isExistCategory = await CategoryModel.findcategoryById(req.body.categoryId);
      if (!isExistCategory)
        return First(res, "Cannot Find This Category", 404, http.FAIL);
    }

    // Validate brand
    if (req.body?.brandId) {
      const isExistBrand = await BrandModel.findBrandById(req.body.brandId);
      if (!isExistBrand)
        return First(res, "Cannot Find This Brand", 404, http.FAIL);
    }

    // Slugify name if provided
    if (req.body?.name) {
      req.body.slug = slugify(req.body.name);
    }

    // Handle car card image upload
    if (req.files?.image) {
      const uploadedCardImage = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `RentACarTesting/Car/${req.body.slug || isCarExist.slug}-${
            req.body.color || isCarExist.color
          }/mainImage`,
        }
      );

      // Destroy old image if it exists
      if (isCarExist.carCardImage) {
        await cloudinary.uploader.destroy(isCarExist.carCardImage);
      }

      // Set new card image URL
      req.body.carCardImage = uploadedCardImage.secure_url;
    }

    // Handle car slider images upload
    if (req.files?.sliderImages) {
      const sliderImagesPaths = await Promise.all(
        req.files.sliderImages.map(async (image) => {
          const uploadedSliderImage = await cloudinary.uploader.upload(
            image.path,
            {
              folder: `RentACarTesting/Car/${
                req.body.slug || isCarExist.slug
              }-${req.body.color || isCarExist.color}/sliderImages`,
            }
          );
          return uploadedSliderImage.secure_url;
        })
      );

      // Destroy old slider images if they exist (and are an array)
      if (Array.isArray(isCarExist.carSliderImages)) {
        await Promise.all(
          isCarExist.carSliderImages.map(async (imageUrl) => {
            await cloudinary.uploader.destroy(imageUrl);
          })
        );
      }

      // Set new slider images URLs
      req.body.carSliderImages = sliderImagesPaths;
    }

    // Update the car in the database
    const car = await CarModel.updateCar(id, {
      name: req.body.name || isCarExist.name,
      slug: req.body.slug || isCarExist.slug,
      color: req.body.color || isCarExist.color,
      modelYear: req.body.modelYear || isCarExist.modelYear,
      seater: req.body.seater || isCarExist.seater,
      powerHourse: req.body.powerHourse || isCarExist.powerHourse,
      KilometersIncluded: req.body.KilometersIncluded || isCarExist.KilometersIncluded,
      rentalCost: req.body.rentalCost || isCarExist.rentalCost,
      carSliderImages: req.body.carSliderImages || isCarExist.carSliderImages, // Ensure it's an array
      carCardImage: req.body.carCardImage || isCarExist.carCardImage,
      categoryId: req.body.categoryId || isCarExist.categoryId,
      brandId: req.body.brandId || isCarExist.brandId,
    });

    if (!car) {
      return First(res, "Car Not Found", 404, http.FAIL);
    }

    return Second(res, ["Done", car], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};



const DeleteCarById = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the document by ID
    const document = await CarModel.findCarById(id);
    if (!document) {
      return First(res, "This document does not exist", 404, http.FAIL);
    }


    if (document.carCardImage?.secure_url) {
      console.log(`Car card image to delete: ${document.carCardImage.secure_url}`);
    }

    // If the document has multiple images (like car slider images)
    if (document.images?.length) {
      for (let i = 0; i < document.images.length; i++) {
        if (document.images[i]?.secure_url) {
          console.log(`Slider image to delete: ${document.images[i].secure_url}`);
        }
      }
    }

    if (document.carSilderImages?.length) {
      for (let i = 0; i < document.carSilderImages.length; i++) {
        if (document.carSilderImages[i]?.secure_url) {
          console.log(`Car slider image to delete: ${document.carSilderImages[i].secure_url}`);
        }
      }
    }

    // Delete the document from the database
    await CarModel.deleteCar(id);

    return Second(res, "Document deleted successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const OrderByDate = async (req, res, next) => {
  try {
    // Get the cars from the database ordered by 'createdAt' ascending
    const result = await CarModel.getOrderByDate('ASC'); // 'ASC' for oldest to newest (use 'DESC' for reverse order)

    // If no cars are found, return a 404 response
    if (result.length === 0) {
      return First(res, "No cars found", 404, http.FAIL);
    }

    // Respond with the cars sorted by date
    return Second(res, ["Done", result], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const OrderByPrice = async (req, res, next) => {
  try {
    // Get the order from the query string (default is 'ASC' for ascending)
    const order = req.query.order || 'ASC';

    // Fetch cars ordered by price using the CarModel method
    const result = await CarModel.getOrderByPrice(order);

    // If no cars are found, return a 404 response
    if (result.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }

    // Return the sorted cars
    return res.status(200).json({ message: "Cars ordered by price", data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const OrderByPriceDesc = async (req, res, next) => {
  try {
    // Fetch cars ordered by price in descending order using the CarModel method
    const result = await CarModel.getOrderByPriceDesc();

    // If no cars are found, return a 404 response
    if (result.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }

    // Return the sorted cars
    return res.status(200).json({ message: "Cars ordered by price (descending)", data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  GetAllCars,
  GetCarById,
  AddNewCar,
  UpdateCarById,
  DeleteCarById,
  OrderByDate,
  OrderByPrice,
  OrderByPriceDesc,
};
