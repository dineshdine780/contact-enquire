const User = require("../models/User");
const bcrypt = require("bcryptjs");
const AuditLog = require("../models/AuditLog");


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


// CREATE ORGANIZATION USER
// ORGANIZATION ADMIN ONLY

exports.createOrganizationUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;


    // Get organization from logged-in admin

    const organizationId =
      req.user.organizationId;


    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned"
      });
    }


    // Required fields

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }


    // Check existing user

    const existingUser =
      await User.findOne({
        email: email.toLowerCase()
      });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }


    // Hash password

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // Create organization user

    const user = await User.create({

      name,

      email: email.toLowerCase(),

      password: hashedPassword,

      role: "organization_user",

      organization: organizationId

    });


    // Remove password from response

    const userResponse =
      await User.findById(user._id)
        .select("-password")
        .populate(
          "organization",
          "organizationName"
        );


    res.status(201).json({

      success: true,

      message:
        "Organization user created successfully",

      user: userResponse

    });


  } catch (error) {

    console.error(
      "Create Organization User Error:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

    });

  }
};


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



// ==========================================
// GET SINGLE ORGANIZATION ADMIN
// PLATFORM ADMIN ONLY
// ==========================================

exports.getOrganizationAdmin = async (req, res) => {
  try {

    const { id } = req.params;


    const user = await User.findOne({
      _id: id,
      role: "organization_admin",
    })
      .select("-password")
      .populate(
        "organization",
        "organizationName status"
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Organization admin not found",
      });
    }


    res.json({
      success: true,
      user,
    });


  } catch (error) {

    console.error(
      "Get Organization Admin Error:",
      error
    );


    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};



// ==========================================
// UPDATE ORGANIZATION ADMIN
// PLATFORM ADMIN ONLY
// ==========================================

exports.updateOrganizationAdmin = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      email,
      organization
    } = req.body;


    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (!name || !email || !organization) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and organization are required",
      });
    }


    // ==========================================
    // FIND ADMIN
    // ==========================================

    const admin = await User.findOne({
      _id: id,
      role: "organization_admin",
    });


    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Organization admin not found",
      });
    }


    // ==========================================
    // CHECK EMAIL
    // ==========================================

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: id },
    });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }


    // ==========================================
    // UPDATE ADMIN
    // ==========================================

    admin.name = name;

    admin.email = email.toLowerCase();

    admin.organization = organization;


    await admin.save();


    // ==========================================
    // GET UPDATED ADMIN
    // ==========================================

    const updatedAdmin =
      await User.findById(admin._id)
        .select("-password")
        .populate(
          "organization",
          "organizationName status"
        );


    // ==========================================
    // AUDIT LOG
    // ==========================================

    await AuditLog.create({

      user: req.user.userId,

      action: "UPDATE_ORGANIZATION_ADMIN",

      organization:
        updatedAdmin.organization?._id || null,

      details:
        `Organization admin ${updatedAdmin.name} updated`,

    });


    // ==========================================
    // RESPONSE
    // ==========================================

    res.json({

      success: true,

      message:
        "Organization admin updated successfully",

      user:
        updatedAdmin,

    });


  } catch (error) {

    console.error(
      "Update Organization Admin Error:",
      error
    );


    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};



// ==========================================
// DELETE ORGANIZATION ADMIN
// PLATFORM ADMIN ONLY
// ==========================================

exports.deleteOrganizationAdmin = async (req, res) => {
  try {

    const { id } = req.params;


    // ==========================================
    // FIND ADMIN
    // ==========================================

    const admin = await User.findOne({
      _id: id,
      role: "organization_admin",
    });


    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Organization admin not found",
      });
    }


    const adminId = admin._id;

    const adminName = admin.name;

    const organizationId =
      admin.organization || null;


    // ==========================================
    // DELETE ADMIN
    // ==========================================

    await User.findByIdAndDelete(id);


    // ==========================================
    // AUDIT LOG
    // ==========================================

    await AuditLog.create({

      user: req.user.userId,

      action: "DELETE_ORGANIZATION_ADMIN",

      organization: organizationId,

      details:
        `Organization admin ${adminName} deleted`,

    });


    // ==========================================
    // RESPONSE
    // ==========================================

    res.json({

      success: true,

      message:
        "Organization admin deleted successfully",

    });


  } catch (error) {

    console.error(
      "Delete Organization Admin Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Server error",

    });

  }
};