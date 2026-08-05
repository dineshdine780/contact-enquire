const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Organization = require("../models/Organization");


// ===============================
// REGISTER USER
// ===============================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      organization,
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }

    // Validate role
    if (
      !["platform_admin", "organization_admin"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Organization admin must have organization
    if (role === "organization_admin" && !organization) {
      return res.status(400).json({
        success: false,
        message: "Organization is required",
      });
    }

    // Check organization exists
    if (role === "organization_admin") {
      const org = await Organization.findById(organization);

      if (!org) {
        return res.status(404).json({
          success: false,
          message: "Organization not found",
        });
      }
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      organization:
        role === "organization_admin"
          ? organization
          : null,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ===============================
// LOGIN USER
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).populate("organization");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        organizationId: user.organization?._id || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// ===============================
// ASSIGN ORGANIZATION TO USER
// Platform Admin only
// ===============================
exports.assignOrganization = async (req, res) => {
  try {
    const { userId, organizationId } = req.body;

    if (!userId || !organizationId) {
      return res.status(400).json({
        success: false,
        message: "userId and organizationId are required",
      });
    }

    // Check organization exists
    const organization = await Organization.findById(
      organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Make sure this is organization admin
    if (user.role !== "organization_admin") {
      return res.status(400).json({
        success: false,
        message: "User is not an organization admin",
      });
    }

    // Assign organization
    user.organization = organization._id;

    await user.save();

    // Return updated user
    const updatedUser = await User.findById(user._id)
      .populate("organization");

    res.json({
      success: true,
      message: "Organization assigned successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        organization: updatedUser.organization,
      },
    });

  } catch (error) {
    console.error("Assign Organization Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};