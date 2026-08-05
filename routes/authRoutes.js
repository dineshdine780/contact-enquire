const express = require("express");

const router = express.Router();

const {
  register,
  login,
  assignOrganization,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// ===============================
// REGISTER
// ===============================

router.post(
  "/register",
  register
);


// ===============================
// LOGIN
// ===============================

router.post(
  "/login",
  login
);


// ===============================
// ASSIGN ORGANIZATION
// Platform Admin only
// ===============================

router.put(
  "/assign-organization",
  authMiddleware,
  roleMiddleware("platform_admin"),
  assignOrganization
);


module.exports = router;