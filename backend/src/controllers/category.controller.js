const Category = require("../models/category.model");

async function createCategoryController(
  req,
  res
) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory =
      await Category.findOne({ name });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category =
      await Category.create({
        name,
        description,
        createdBy: req.user._id,
      });

    res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllCategoriesController(
  req,
  res
) {
  try {
    const categories =
      await Category.find({
        isActive: true,
      }).populate(
        "createdBy",
        "name email"
      );

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateCategoryController(
  req,
  res
) {
  try {
    const { name, description } =
      req.body;

    const category =
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
        },
        {
          new: true,
        }
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteCategoryController(
  req,
  res
) {
  try {
    const category =
      await Category.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!category.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Category already deleted",
      });
    }

    category.isActive = false;

    await category.save();

    res.status(200).json({
      success: true,
      message:
        "Category deleted successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,}