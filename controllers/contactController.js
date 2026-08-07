const Contact = require("../models/Contact");
const Organization = require("../models/Organization");


// Create enquiry
exports.createContact = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      organization,
      name,
      email,
      subject,
      message,
      priority
    } = req.body;


    // Check organization
    const org = await Organization.findById(organization);

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }


    // Create contact
    const contact = await Contact.create({
      organization: org._id,
      name,
      email,
      subject,
      message,
      priority,
      status: "Open",
      attachment: req.file ? req.file.filename : ""
    });


    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      contact
    });

  } catch (error) {

    console.error("CREATE CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};





// Create enquiry from external website


exports.createPublicContact = async (req, res) => {
  try {
    console.log("PUBLIC CONTACT BODY:", req.body);
    console.log("PUBLIC CONTACT FILE:", req.file);

    const { publicSlug } = req.params;

    const {
      name,
      email,
      subject,
      message,
      priority
    } = req.body;


    
    // Validate required fields
    

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required"
      });
    }


    // -----------------------------
    // Find organization
    // -----------------------------

    const organization = await Organization.findOne({
      publicSlug: publicSlug.toLowerCase(),
      status: "Active"
    });


    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive"
      });
    }


    // -----------------------------
    // Create contact
    // -----------------------------

    const contact = await Contact.create({
      organization: organization._id,

      name: name.trim(),

      email: email.trim().toLowerCase(),

      subject: subject.trim(),

      message: message.trim(),

      priority: priority || "Low",

      status: "Open",

      attachment: req.file
        ? req.file.filename
        : ""
    });


    
    // Response
    

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      contact
    });


  } catch (error) {

    console.error(
      "CREATE PUBLIC CONTACT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry"
    });

  }
};







// GET ENQUIRIES BY LOGGED-IN ORGANIZATION


exports.getContactsByOrganization = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned to user",
      });
    }

    const contacts = await Contact.find({
      organization: organizationId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error(
      "GET ORGANIZATION CONTACTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





// GET SINGLE ENQUIRY
// Organization Admin only


exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const organizationId =
      req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned to user",
      });
    }

    const contact = await Contact.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });

  } catch (error) {
    console.error(
      "GET ENQUIRY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// UPDATE ENQUIRY STATUS
// Organization Admin only


exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const organizationId =
      req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned to user",
      });
    }

    // Validate status

    const allowedStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status",
      });
    }

    // Find enquiry belonging to this organization

    const contact =
      await Contact.findOneAndUpdate(
        {
          _id: id,
          organization: organizationId,
        },
        {
          status,
        },
        {
          new: true,
        }
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully",
      contact,
    });

  } catch (error) {
    console.error(
      "UPDATE ENQUIRY STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




// UPDATE ENQUIRY


exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      priority,
      status
    } = req.body;

    // Get organization from logged-in user
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned",
      });
    }

    // Validate priority
    const validPriorities = [
      "Urgent",
      "Medium",
      "Low"
    ];

    if (
      priority &&
      !validPriorities.includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    // Validate status
    const validStatuses = [
      "Open",
      "In Progress",
      "Resolved",
      "Closed"
    ];

    if (
      status &&
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

   
    const enquiry = await Contact.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    
    if (priority) {
      enquiry.priority = priority;
    }

    if (status) {
      enquiry.status = status;
    }

    await enquiry.save();

    res.json({
      success: true,
      message: "Enquiry updated successfully",
      contact: enquiry,
    });

  } catch (error) {
    console.error(
      "UPDATE CONTACT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};