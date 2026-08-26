const express = require("express");

const router = express.Router();

const {
  getOrganizationUsers,
  createOrganizationUser,
  getOrganizationAdmins,
  getOrganizationAdmin,
  updateOrganizationAdmin,
  deleteOrganizationAdmin

} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// GET ORGANIZATION USERS


router.get(
  "/organization",
  authMiddleware,
  roleMiddleware("organization_admin"),
  getOrganizationUsers
);



// CREATE ORGANIZATION USER


router.post(
  "/organization",
  authMiddleware,
  roleMiddleware("platform_admin"),
  createOrganizationUser
);


router.post(
  "/organization-user",
  authMiddleware,
  roleMiddleware("organization_admin"),
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



// GET SINGLE ORGANIZATION ADMIN
// PLATFORM ADMIN ONLY


router.get(

  "/organization-admins/:id",
  authMiddleware,
  roleMiddleware("platform_admin"),
  getOrganizationAdmin
);



// UPDATE ORGANIZATION ADMIN
// PLATFORM ADMIN ONLY

router.put(
  "/organization-admins/:id",
  authMiddleware,
  roleMiddleware("platform_admin"),
  updateOrganizationAdmin
);



// DELETE ORGANIZATION ADMIN
// PLATFORM ADMIN ONLY


router.delete(
  "/organization-admins/:id",
  authMiddleware,
  roleMiddleware("platform_admin"),
  deleteOrganizationAdmin
);


module.exports = router;