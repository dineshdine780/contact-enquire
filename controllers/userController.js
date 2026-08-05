const User = require("../models/User");


// ==========================================
// GET ORGANIZATION USERS
// ==========================================

exports.getOrganizationUsers = async (req, res) => {
  try {

    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned",
      });
    }


    const users = await User.find({
      organization: organizationId,
    })
      .select("-password")
      .populate(
        "organization",
        "organizationName"
      )
      .sort({ createdAt: -1 });


    res.json({
      success: true,
      users,
    });

  } catch (error) {

    console.error(
      "Get Organization Users Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};