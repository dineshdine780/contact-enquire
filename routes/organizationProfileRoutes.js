const express = require("express");

const router = express.Router();

const {
  getOrganizationProfile,
} = require("../controllers/organizationProfileController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// GET ORGANIZATION PROFILE


router.get(
  "/",
  authMiddleware,
  roleMiddleware("organization_admin"),
  getOrganizationProfile
);


module.exports = router;