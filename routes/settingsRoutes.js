const express = require("express");

const router = express.Router();

const {
    getSettings,
    updateSettings
} = require("../controllers/settingsController");


// Get settings

router.get("/", getSettings);

// Update settings

router.put("/", updateSettings);

module.exports = router;