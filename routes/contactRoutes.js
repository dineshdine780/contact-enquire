const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createContact,            
  createPublicContact,      
  getContactsByOrganization,
  getContactById,           
  updateContactStatus,
  updateContact       
} = require("../controllers/contactController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const organizationMiddleware = require("../middleware/organizationMiddleware");



router.post(
  "/public/:publicSlug",
  upload.single("attachment"),
  createPublicContact
);



router.post(
  "/",
  upload.single("attachment"),
  createContact
);



router.get(
  "/organization",
  authMiddleware,
  roleMiddleware("organization_admin", "organization_user"),
  getContactsByOrganization
);



// GET SINGLE ENQUIRY


router.get(
  "/organization/:id",
  authMiddleware,
  roleMiddleware("organization_admin"),
  getContactById
);



// UPDATE ENQUIRY STATUS


router.put(
  "/organization/:id/status",
  authMiddleware,
  roleMiddleware("organization_admin"),
  updateContactStatus
);



// UPDATE ENQUIRY
// Status + Priority
// Organization Admin only

router.put(
  "/organization/:id",
  authMiddleware,
  roleMiddleware("organization_admin"),
  organizationMiddleware,
  updateContact
);


module.exports = router;