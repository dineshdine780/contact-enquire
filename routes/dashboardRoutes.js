const express = require("express");

const router = express.Router();

const {
  getOrganizationDashboard,
  getPlatformDashboard,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



router.get(
  "/organization",
  authMiddleware,
  roleMiddleware("organization_admin"),
  getOrganizationDashboard
);


router.get(
  "/platform",
  authMiddleware,
  roleMiddleware("platform_admin"),
  getPlatformDashboard
);


module.exports = router;