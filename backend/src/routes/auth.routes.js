const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");








router.post("/register",authController.registerUser);
router.post("/login",authController.loginUser)
router.get("/profile",authMiddleware,authController.getProfileController)
router.get("/admin",authMiddleware,authController.adminDashboardController)
router.post("/logout",authController.userLogoutController)
router.put("/update-profile",authMiddleware,authController.updateProfileController)
router.put("/change-password",authMiddleware,authController.changePasswordController)
router.get("/users",authMiddleware, authorizeRoles("admin"),authController.getAllUsersController)
router.put("/update-role/:id/role",authMiddleware, authorizeRoles("admin"),authController.updateUserRoleController)
module.exports = router;