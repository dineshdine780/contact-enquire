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

    
    // CHECK ORGANIZATION
    

    const organization =
      await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (organization.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Organization is not active",
      });
    }


    
    // TOTAL CUSTOMERS
    

    const totalCustomers =
      await Customer.countDocuments({
        organization: organizationId,
      });



    // TOTAL ENQUIRIES
   

    const totalEnquiries =
      await Contact.countDocuments({
        organization: organizationId,
      });


   
    // OPEN ENQUIRIES
    

    const openEnquiries =
      await Contact.countDocuments({
        organization: organizationId,
        status: "Open",
      });


    
    // URGENT ENQUIRIES
    

    const urgentCases =
      await Contact.countDocuments({
        organization: organizationId,
        priority: "Urgent",
      });


    
    // RESOLVED ENQUIRIES
    

    const resolved =
      await Contact.countDocuments({
        organization: organizationId,
        status: "Resolved",
      });


    
    // RESPONSE
    

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





// PLATFORM ADMIN DASHBOARD


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