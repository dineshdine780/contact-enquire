const Customer = require("../models/Customer");
const Contact = require("../models/Contact");
const Organization = require("../models/Organization");



// ORGANIZATION DASHBOARD


exports.getOrganizationDashboard = async (req, res) => {
  try {
    // Get organization from logged-in user's JWT
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization not assigned to user",
      });
    }

    // Total customers
    const totalCustomers =
      await Customer.countDocuments({
        organization: organizationId,
      });

    // Total enquiries
    const totalEnquiries =
      await Contact.countDocuments({
        organization: organizationId,
      });

    // Open enquiries
    const openEnquiries =
      await Contact.countDocuments({
        organization: organizationId,
        status: "Open",
      });

    // Urgent enquiries
    const urgentCases =
      await Contact.countDocuments({
        organization: organizationId,
        priority: "Urgent",
      });

    // Resolved enquiries
    const resolved =
      await Contact.countDocuments({
        organization: organizationId,
        status: "Resolved",
      });

    res.json({
      success: true,

      stats: {
        totalCustomers,
        totalEnquiries,
        openEnquiries,
        urgentCases,
        resolved,
      },
    });

  } catch (error) {
    console.error(
      "Organization Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




// ==========================================
// PLATFORM ADMIN DASHBOARD
// ==========================================

exports.getPlatformDashboard = async (req, res) => {
  try {

    // Total organizations
    const totalOrganizations =
      await Organization.countDocuments();


    // Active organizations
    const activeOrganizations =
      await Organization.countDocuments({
        status: "Active",
      });


    // Pending organizations
    const pendingApprovals =
      await Organization.countDocuments({
        status: "Pending",
      });


    // Total enquiries
    const totalEnquiries =
      await Contact.countDocuments();


    res.json({
      success: true,

      stats: {
        totalOrganizations,
        activeOrganizations,
        pendingApprovals,
        totalEnquiries,
      },
    });

  } catch (error) {

    console.error(
      "Platform Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};