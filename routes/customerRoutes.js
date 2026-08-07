const express = require("express");

const router = express.Router();

const {
  getOrganizationCustomers,
  createCustomer,
} = require("../controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// GET ORGANIZATION CUSTOMERS


router.get(
  "/organization",
  authMiddleware,
  roleMiddleware("organization_admin"),
  getOrganizationCustomers
);



// CREATE CUSTOMER


router.post(
  "/",
  authMiddleware,
  roleMiddleware("organization_admin"),
  createCustomer
);


module.exports = router;