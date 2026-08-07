const express = require("express");

const router = express.Router();

const {
  getOrganizationUsers,
  createOrganizationUser,
   getOrganizationAdmins
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// ==========================================
// GET ORGANIZATION USERS
// ==========================================

router.get(
  "/organization",
  authMiddleware,
  roleMiddleware("organization_admin"),
  getOrganizationUsers
);


router.post(
  "/organization",
  authMiddleware,
  roleMiddleware("platform_admin"),
  createOrganizationUser
);



// GET ALL ORGANIZATION ADMINS
// PLATFORM ADMIN ONLY


router.get(
  "/organization-admins",
  authMiddleware,
  roleMiddleware("platform_admin"),
  getOrganizationAdmins
);


module.exports = router;