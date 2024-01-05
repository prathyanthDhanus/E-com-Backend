const admin = require("../models/adminSchema");
const categories = require("../models/categorySchema");
const subCategories = require("../models/subCategorySchema");
const product = require("../models/productSchema");

//----------------------admin register-------------------

const adminRegister = async (req, res) => {
  const { adminName, email, password } = req.body;
 
  const identifyAdmin = await admin.findOne({ email: email });

  if (identifyAdmin) {
    return res.json({
      status: "failure",

      message: "Admin Already Exist",
    });
  }

  const newAdmin = new admin({
    adminName: adminName,
    email: email,
    password: password,
  });

  await newAdmin.save();
  return res.json({
    status: "success",

    message: "Admin Registered Successfully",
  });
};

//--------------------------admin login-----------------------

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const identifyAdmin = await admin.findOne({ email: email });
  if (!identifyAdmin) {
    return res.json({
      status: "failure",

      message: "Admin not found",
    });
  } else if (password !== identifyAdmin.password) {
    return res.json({
      status: "failure",

      message: "Wrong Password",
    });
  } else {
    return res.status(200).json({
      status: "success",
      message: "Admin logged in successfully",
    });
  }
};

//-----------------------add category-------------------

const createCategory = async (req, res) => {
  const { category } = req.body;
  const findCategory = await categories.findOne({ category: category });
  if (findCategory) {
    return res.status(400).json({
      status: "failure",

      message: "Category already exist",
    });
  }
  const newCategory = new categories({ category: category });
  await newCategory.save();
  return res.status(201).json({
    status: "success",

    message: "Category created successfully",
  });
};

//----------------------get category---------------------

const getCategory = async (req, res) => {
  const findCategory = await categories.find();

  if (findCategory.length === 0) {
    return res.status(400).json({
      status: "failure",

      message: "No category",
    });
  }
  return res.status(200).json({
    status: "success",

    message: "Category found successfully",

    data: findCategory,
  });
};

//-------------------------create subcategory------------------

const createSubCategory = async (req, res) => {
  const { subCategory } = req.body;
  const categoryId = req.params.id;
  // Check if the category exists
  const findCategory = await categories.findById(categoryId);

  if (!findCategory) {
    return res.status(400).json({
      status: "failure",
      message: "Invalid category ID",
    });
  }

  // Check if the subcategory already exists
  const findSubCategory = await subCategories.findOne({
    subCategory: subCategory,
    category: categoryId,
  });

  if (findSubCategory) {
    return res.status(400).json({
      status: "failure",
      message: "Subcategory already exists in this category",
    });
  }

  // Create a new subcategory
  const newSubCategory = new subCategories({
    subCategory: subCategory,
    category: categoryId,
  });
  await newSubCategory.save();

  return res.status(201).json({
    status: "success",
    message: "Subcategory created successfully",
    data: newSubCategory,
  });
};

//-------------------------get subCategory--------------------

const getSubCategory = async (req, res) => {
  const findSubCategory = await subCategories.find();

  if (findSubCategory === 0) {
    return res.status(404).json({
      status: "failure",
      message: "Subcategory not found",
      data: findSubCategory,
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Subcategory found",
    data: findSubCategory,
  });
};

//--------------------------create product---------------------

const createProduct = async (req, res) => {
  const { title, ram, price, description, countInStock, image } = req.body;
  
  const subCategoryId = req.params.subCategoryId;
  

  // Check if the product exists
  const existingProduct = await product.findOne({
    title,
    ram,
    subCategory: subCategoryId,
  });

  if (existingProduct) {
    return res.status(400).json({
      status: "failure",
      message:
        "Product with the same title and ram already exists in this subcategory.",
    });
  }

  // Create a new product
  const newProduct = new product({
    title,
    ram,
    price,
    subCategory: subCategoryId,
    description,
    countInStock,
    image,
  });

  // Save the product
  await newProduct.save();

  return res.status(201).json({
    status: "success",
    message: "Product added to subcategory successfully",
    data: newProduct,
  });
};

//-----------------------------get products----------------------------------

const getProducts = async (req, res) => {
  const findProducts = await product.find();

  if (findProducts === 0) {
    return res.status(404).json({
      status: "success",
      message: "No products available",
      data: findProducts,
    });
  }
  return res.status(200).json({
    status: "success",
    message: "Product received successfully",
    data: findProducts,
  });
};

//-----------------------------update produst-------------------------

const updateProduct = async (req, res) => {
  const productData = req.body;
  const productId = req.params.productId;
  const findProduct = await product.findByIdAndUpdate(productId, productData, {
    new: true,
  });
  return res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: findProduct,
  });
};

module.exports = {
  adminRegister,
  adminLogin,
  createCategory,
  getCategory,
  createSubCategory,
  getSubCategory,
  createProduct,
  getProducts,
  updateProduct
};
