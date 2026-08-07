const User = require("../models/User");
const bcrypt = require("bcryptjs");


// GET ORGANIZATION USERS


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




// CREATE ORGANIZATION USER


exports.createOrganizationUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      organization
    } = req.body;

    if (!name || !email || !password || !role || !organization) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (role !== "organization_admin") {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "organization_admin",
      organization
    });

    const userResponse = await User.findById(
      user._id
    )
      .select("-password")
      .populate(
        "organization",
        "organizationName"
      );

    res.status(201).json({
      success: true,
      message: "Organization admin created successfully",
      user: userResponse
    });

  } catch (error) {

    console.error(
      "Create Organization User Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




// GET ALL ORGANIZATION ADMINS
// PLATFORM ADMIN ONLY


exports.getOrganizationAdmins = async (req, res) => {
  try {

    const users = await User.find({
      role: "organization_admin",
    })
      .select("-password")
      .populate(
        "organization",
        "organizationName status"
      )
      .sort({
        createdAt: -1,
      });


    res.json({
      success: true,
      users,
    });


  } catch (error) {

    console.error(
      "Get Organization Admins Error:",
      error
    );


    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};