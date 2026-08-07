const express = require("express");

const router = express.Router();

const {
  register,
  login,
  assignOrganization,
  createOrganizationAdmin
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// REGISTER


router.post(
  "/register",
  register
);



// LOGIN


router.post(
  "/login",
  login
);



// ASSIGN ORGANIZATION
// Platform Admin only


router.put(
  "/assign-organization",
  authMiddleware,
  roleMiddleware("platform_admin"),
  assignOrganization
);



// CREATE ORGANIZATION ADMIN
// Platform Admin only


router.post(
  "/organization-admin",
  authMiddleware,
  roleMiddleware("platform_admin"),
  createOrganizationAdmin
);


module.exports = router;