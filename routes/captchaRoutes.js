const express = require("express");

const router = express.Router();

const {
  generateCaptcha,
} = require("../controllers/captchaController");


// ========================================
// GENERATE CAPTCHA
// ========================================

router.get(
  "/generate",
  generateCaptcha
);


module.exports = router;