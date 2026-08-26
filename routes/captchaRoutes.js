const express = require("express");

const router = express.Router();

const {
  generateCaptcha,
  generateAdminCaptcha,
} = require("../controllers/captchaController");



// GENERATE CAPTCHA


router.get(
  "/generate",
  generateCaptcha
);

router.get(
  "/admin/generate",
  generateAdminCaptcha
);


module.exports = router;