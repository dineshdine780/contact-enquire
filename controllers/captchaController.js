const svgCaptcha = require("svg-captcha");


// ========================================
// GENERATE CAPTCHA
// ========================================

exports.generateCaptcha = async (req, res) => {

  try {

    const captcha = svgCaptcha.create({

      size: 5,

      noise: 2,

      color: true,

      background: "#f3f4f6",

      ignoreChars: "0o1il",

      fontSize: 60,

      width: 180,

      height: 60,

    });


    // ========================================
    // STORE CAPTCHA IN SESSION
    // ========================================

    req.session.captcha =
      captcha.text;


    // ========================================
    // SAVE SESSION
    // ========================================

    req.session.save((error) => {

      if (error) {

        console.error(
          "CAPTCHA SESSION SAVE ERROR:",
          error
        );

        return res.status(500).json({

          success: false,

          message:
            "Failed to save CAPTCHA session",

        });

      }


      // ========================================
      // RESPONSE
      // ========================================

      return res.status(200).json({

        success: true,

        captcha:
          captcha.data,

      });

    });

  } catch (error) {

    console.error(
      "GENERATE CAPTCHA ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to generate CAPTCHA",

    });

  }

};




// GENERATE ADMIN CAPTCHA

// ========================================
// GENERATE ADMIN CAPTCHA
// ========================================

exports.generateAdminCaptcha = async (req, res) => {

  try {

    const captcha = svgCaptcha.create({

      size: 5,

      noise: 2,

      color: true,

      background: "#f3f4f6",

      ignoreChars: "0o1il",

      fontSize: 60,

      width: 180,

      height: 60,

    });


    // ========================================
    // STORE ADMIN CAPTCHA IN SESSION
    // ========================================

    req.session.adminCaptcha =
      captcha.text;


    console.log(
      "ADMIN CAPTCHA CREATED:",
      captcha.text
    );


    // ========================================
    // SAVE SESSION
    // ========================================

    req.session.save((error) => {

      if (error) {

        console.error(
          "ADMIN CAPTCHA SESSION SAVE ERROR:",
          error
        );

        return res.status(500).json({

          success: false,

          message:
            "Failed to save CAPTCHA session",

        });

      }


      // ========================================
      // RESPONSE
      // ========================================

      return res.status(200).json({

        success: true,

        captcha:
          captcha.data,

      });

    });

  } catch (error) {

    console.error(
      "GENERATE ADMIN CAPTCHA ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to generate CAPTCHA",

    });

  }

};