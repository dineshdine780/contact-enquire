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



// Get enquiries by organization
exports.getContactsByOrganization = async (req, res) => {

  try {

    const { organizationId } = req.params;


    const contacts = await Contact.find({
      organization: organizationId
    })
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      contacts
    });

  } catch (error) {

    console.error("GET CONTACTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};