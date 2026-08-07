const Organization = require("../models/Organization");
const AuditLog = require("../models/AuditLog");


// Create Organization
exports.createOrganization = async (req, res) => {
  try {
    const {
      organizationName,
      type,
      website
    } = req.body;


    // Required fields

    if (!organizationName || !type) {
      return res.status(400).json({
        success: false,
        message: "Organization name and type are required"
      });
    }


    // Check existing organization

    const existingOrganization =
      await Organization.findOne({
        organizationName
      });

    if (existingOrganization) {
      return res.status(400).json({
        success: false,
        message: "Organization already exists"
      });
    }



    // CREATE PUBLIC SLUG
    

    let publicSlug = organizationName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");


    // Check slug already exists

    const existingSlug =
      await Organization.findOne({
        publicSlug
      });


    if (existingSlug) {

      publicSlug =
        `${publicSlug}-${Date.now()}`;

    }


 
    // CREATE ORGANIZATION
    

    const organization =
      await Organization.create({

        organizationName,

        type,

        website,

        publicSlug

      });


    res.status(201).json({

      success: true,

      message:
        "Organization created successfully",

      organization

    });


  } catch (error) {

    console.error(
      "CREATE ORGANIZATION ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message

    });

  }
};


// Get all Organizations
exports.getOrganizations = async (req, res) => {
  try {

    const organizations =
      await Organization.find()
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      organizations
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// Get single Organization
exports.getOrganization = async (req, res) => {
  try {

    const organization =
      await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    res.json({
      success: true,
      organization
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// Update Organization
exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      organizationName,
      type,
      website,
      status
    } = req.body;

    const organization =
      await Organization.findByIdAndUpdate(
        id,
        {
          organizationName,
          type,
          website,
          status
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    // Create audit log
    await AuditLog.create({
      user: req.user.userId,
      action: "UPDATE_ORGANIZATION",
      organization: organization._id,
      details: `Organization ${organization.organizationName} updated`
    });

    res.json({
      success: true,
      message: "Organization updated successfully",
      organization
    });

  } catch (error) {
    console.error(
      "Update Organization Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Delete Organization
exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

   
    const organization =
      await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    
    const organizationId = organization._id;
    const organizationName =
      organization.organizationName;

    
    await Organization.findByIdAndDelete(id);

   
    await AuditLog.create({
      user: req.user.userId,
      action: "DELETE_ORGANIZATION",
      organization: organizationId,
      details: `Organization ${organizationName} deleted`,
    });

    res.json({
      success: true,
      message: "Organization deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Organization Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// GET PENDING ORGANIZATIONS


exports.getPendingOrganizations = async (req, res) => {
  try {

    const organizations =
      await Organization.find({
        status: "Pending",
      }).sort({
        createdAt: -1,
      });


    res.json({
      success: true,
      organizations,
    });

  } catch (error) {

    console.error(
      "Get Pending Organizations Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




// APPROVE ORGANIZATION


exports.approveOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const organization =
      await Organization.findByIdAndUpdate(
        id,
        {
          status: "Active",
        },
        {
          new: true,
        }
      );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }


    // Create audit log
    await AuditLog.create({
      user: req.user.userId,
      action: "APPROVE_ORGANIZATION",
      organization: organization._id,
      details: `Organization ${organization.organizationName} approved`,
    });


    res.json({
      success: true,
      message: "Organization approved successfully",
      organization,
    });

  } catch (error) {
    console.error(
      "Approve Organization Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// REJECT ORGANIZATION


exports.rejectOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const organization =
      await Organization.findByIdAndUpdate(
        id,
        {
          status: "Inactive",
        },
        {
          new: true,
        }
      );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    
    await AuditLog.create({
      user: req.user.userId,
      action: "REJECT_ORGANIZATION",
      organization: organization._id,
      details: `Organization ${organization.organizationName} rejected`,
    });

    res.json({
      success: true,
      message: "Organization rejected successfully",
      organization,
    });

  } catch (error) {
    console.error(
      "Reject Organization Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



exports.getPublicOrganization = async (req, res) => {
  try {

    const { publicSlug } = req.params;

    if (!publicSlug) {
      return res.status(400).json({
        success: false,
        message: "Public slug is required"
      });
    }


    const organization =
      await Organization.findOne({
        publicSlug: publicSlug.toLowerCase(),
        status: "Active"
      }).select(
        "_id organizationName type website publicSlug status"
      );


    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }


    return res.status(200).json({
      success: true,
      organization
    });


  } catch (error) {

    console.error(
      "GET PUBLIC ORGANIZATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};