const Customer = require("../models/Customer");


// ==========================================
// GET ORGANIZATION CUSTOMERS
// ==========================================

exports.getOrganizationCustomers = async (req, res) => {
  try {

    // Get organization from JWT
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned",
      });
    }


    // Get customers belonging to logged-in organization
    const customers = await Customer.find({
      organization: organizationId,
    })
      .populate("organization", "organizationName")
      .sort({ createdAt: -1 });


    res.json({
      success: true,
      customers,
    });

  } catch (error) {

    console.error(
      "Get Organization Customers Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// CREATE CUSTOMER
// ==========================================

exports.createCustomer = async (req, res) => {
  try {

    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned",
      });
    }


    const {
      name,
      email,
      phone,
      company,
      status,
    } = req.body;


    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }


    const customer = await Customer.create({
      organization: organizationId,
      name,
      email,
      phone,
      company,
      status,
    });


    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });

  } catch (error) {

    console.error(
      "Create Customer Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.getCustomersByOrganization = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization not assigned to user",
      });
    }

    const customers = await Customer.find({
      organization: organizationId,
    }).populate(
      "organization",
      "organizationName"
    );

    res.json({
      success: true,
      customers,
    });

  } catch (error) {
    console.error(
      "Get Organization Customers Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};