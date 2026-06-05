const express = require("express");
const categoryController=require("../controllers/category.controller")

const router = express.Router();

const authMiddleware = require(
  "../middleware/auth.middleware"
);

const authorizeRoles = require(
  "../middleware/role.middleware"
);

router.post("/",authMiddleware,authorizeRoles("admin"),categoryController.createCategoryController)
router.get("/get-all-categories",authMiddleware,categoryController.getAllCategoriesController)
router.put("/update-category/:id",authMiddleware,authorizeRoles("admin"),categoryController.updateCategoryController)
router.delete("/delete/:id",authMiddleware,authorizeRoles("admin"),categoryController.deleteCategoryController)

module.exports = router;