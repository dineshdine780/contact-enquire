const express = require("express");

const router = express.Router();

const {
  getOrganizationUsers,
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


module.exports = router;