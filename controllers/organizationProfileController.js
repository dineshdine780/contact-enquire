const Organization = require("../models/Organization");



// GET ORGANIZATION PROFILE


exports.getOrganizationProfile = async (req, res) => {
  try {

    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned",
      });
    }


    const organization =
      await Organization.findById(
        organizationId
      );


    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }


    res.json({
      success: true,
      organization,
    });

  } catch (error) {

    console.error(
      "Get Organization Profile Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};