const express = require("express");

const router = express.Router();

const {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getPendingOrganizations,
  approveOrganization,
  rejectOrganization,
  getPublicOrganization
} = require("../controllers/organizationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// CREATE ORGANIZATION


router.post(
  "/",
  authMiddleware,
  roleMiddleware("platform_admin"),
  createOrganization
);



// GET ALL ORGANIZATIONS


router.get(
  "/",
  authMiddleware,
  roleMiddleware("platform_admin"),
  getOrganizations
);



// GET PENDING ORGANIZATIONS
// IMPORTANT: Must be BEFORE /:id


router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("platform_admin"),
  getPendingOrganizations
);



// APPROVE ORGANIZATION
// IMPORTANT: Must be BEFORE /:id


router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("platform_admin"),
  approveOrganization
);



// REJECT ORGANIZATION
// IMPORTANT: Must be BEFORE /:id


router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("platform_admin"),
  rejectOrganization
);



// GET ORGANIZATION BY ID

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("platform_admin"),
  getOrganization
);



router.get(
  "/public/:publicSlug",
  getPublicOrganization
);


// UPDATE ORGANIZATION

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("platform_admin"),
  updateOrganization
);



// DELETE ORGANIZATION


router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("platform_admin"),
  deleteOrganization
);





module.exports = router;