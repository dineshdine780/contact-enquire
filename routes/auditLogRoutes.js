const express = require("express");

const router = express.Router();

const {
  getAuditLogs,
} = require("../controllers/auditLogController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");




router.get(
  "/",
  authMiddleware,
  roleMiddleware("platform_admin"),
  getAuditLogs
);


module.exports = router;