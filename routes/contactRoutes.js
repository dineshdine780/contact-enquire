const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createContact,
  getContactsByOrganization,
} = require("../controllers/contactController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const organizationMiddleware = require("../middleware/organizationMiddleware");



router.post(
  "/",
  upload.single("attachment"),
  createContact
);



router.get(
  "/organization/:organizationId",
  authMiddleware,
  roleMiddleware("organization_admin"),
  organizationMiddleware,
  getContactsByOrganization
);


module.exports = router;