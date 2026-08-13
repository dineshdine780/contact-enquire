const Contact = require("../models/Contact");
const Organization = require("../models/Organization");
const Customer = require("../models/Customer");
const svgCaptcha = require("svg-captcha");

// Create enquiry
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
      priority,
    } = req.body;

    // Check required fields

    if (
      !organization ||
      !name ||        
      !email ||       
      !subject ||      
      !message        
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Organization, name, email, subject and message are required",
      });
    }

    // Check organization

    const org = await Organization.findById(
      organization
    );

    if (!org) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    // Clean customer data
    const customerName = name.trim();

    const customerEmail =
      email.trim().toLowerCase();

    // Create enquiry
    const contact = await Contact.create({
      organization: org._id,
      name: customerName,
      email: customerEmail,
      subject: subject.trim(),
      message: message.trim(),
      priority: priority || "Low",
      status: "Open",
      attachment: req.file
        ? req.file.filename
        : "",
    });

    // Find existing customer
    let customer = await Customer.findOne({
      organization: org._id,
      email: customerEmail,
    });

    // Existing customer
    if (customer) {
      customer.name = customerName;
      customer.lastActivity = new Date();
      customer.status = "Active";

      if (!customer.tags.includes("New Lead")) {
        customer.tags.push("New Lead");
      }

      await customer.save();

      console.log(
        "Existing customer updated:",
        customer._id
      );
    }

    // New customer
    else {
      customer = await Customer.create({
        organization: org._id,
        name: customerName,
        email: customerEmail,
        status: "Active",
        lastActivity: new Date(),
        tags: ["New Lead"],
        points: 0,
      });

      console.log(
        "New customer created:",
        customer._id
      );
    }

    // Response
    res.status(201).json({
      success: true,
      message:
        "Enquiry submitted successfully",
      contact,
      customer,
    });

  } catch (error) {

    console.error(
      "CREATE CONTACT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CREATE ENQUIRY FROM EXTERNAL WEBSITE

// ========================================
// CREATE ENQUIRY FROM EXTERNAL WEBSITE
// ========================================

exports.createPublicContact = async (req, res) => {

  try {

    console.log(
      "========================================"
    );

    console.log(
      "PUBLIC CONTACT REQUEST"
    );

    console.log(
      "========================================"
    );


    console.log(
      "PUBLIC CONTACT BODY:",
      req.body
    );


    console.log(
      "PUBLIC CONTACT FILE:",
      req.file
    );


    const { publicSlug } =
      req.params;


    const {
      name,
      email,
      subject,
      message,
      priority,
      captchaAnswer,
    } = req.body;


    // ========================================
    // CAPTCHA VALIDATION
    // ========================================

    if (!captchaAnswer) {

      return res.status(400).json({

        success: false,

        message:
          "CAPTCHA is required",

      });

    }


    // ========================================
    // GET CAPTCHA FROM SESSION
    // ========================================

    const correctCaptcha =
      req.session?.captcha;


    if (!correctCaptcha) {

      return res.status(400).json({

        success: false,

        message:
          "CAPTCHA expired. Please refresh the CAPTCHA.",

      });

    }


    // ========================================
    // COMPARE CAPTCHA
    // ========================================

    if (
      captchaAnswer
        .trim()
        .toLowerCase() !==
      correctCaptcha
        .trim()
        .toLowerCase()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Incorrect CAPTCHA. Please try again.",

      });

    }


    // ========================================
    // REMOVE CAPTCHA AFTER VERIFICATION
    // ========================================

    delete req.session.captcha;


    // ========================================
    // VALIDATE REQUIRED FIELDS
    // ========================================

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Name, email, subject and message are required",

      });

    }


    // ========================================
    // FIND ORGANIZATION
    // ========================================

    const organization =
      await Organization.findOne({

        publicSlug:
          publicSlug.toLowerCase(),

        status: "Active",

      });


    console.log(
      "FOUND ORGANIZATION:",
      organization
    );


    if (!organization) {

      return res.status(404).json({

        success: false,

        message:
          "Organization not found or inactive",

      });

    }


    console.log(
      "ORGANIZATION ID:",
      organization._id
    );


    // ========================================
    // CLEAN DATA
    // ========================================

    const customerName =
      name.trim();


    const customerEmail =
      email
        .trim()
        .toLowerCase();


    // ========================================
    // CREATE ENQUIRY
    // ========================================

    const contact =
      await Contact.create({

        organization:
          organization._id,

        name:
          customerName,

        email:
          customerEmail,

        subject:
          subject.trim(),

        message:
          message.trim(),

        priority:
          priority || "Low",

        status:
          "Open",

        attachment:
          req.file
            ? req.file.filename
            : "",

      });


    console.log(
      "CONTACT CREATED:",
      contact._id
    );


    // ========================================
    // FIND OR CREATE CUSTOMER
    // ========================================

    let customer =
      await Customer.findOneAndUpdate(

        {
          organization:
            organization._id,

          email:
            customerEmail,
        },


        {
          $set: {

            name:
              customerName,

            lastActivity:
              new Date(),

            status:
              "Active",

          },


          $addToSet: {

            tags:
              "New Lead",

          },


          $setOnInsert: {

            organization:
              organization._id,

            email:
              customerEmail,

            points:
              0,

          },

        },


        {
          new: true,

          upsert: true,

          runValidators: true,

          setDefaultsOnInsert: true,

        }

      );


    console.log(
      "CUSTOMER CREATED / UPDATED:"
    );


    console.log(
      "CUSTOMER ID:",
      customer._id
    );


    console.log(
      "CUSTOMER ORGANIZATION:",
      customer.organization
    );


    console.log(
      "CUSTOMER EMAIL:",
      customer.email
    );


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({

      success: true,

      message:
        "Enquiry submitted successfully",

      contact,

      customer,

    });


  } catch (error) {

    console.error(
      "========================================"
    );


    console.error(
      "CREATE PUBLIC CONTACT ERROR:"
    );


    console.error(
      error
    );


    console.error(
      "========================================"
    );


    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to submit enquiry",

    });

  }

};


// exports.createPublicContact = async (req, res) => {
//   try {
//     console.log("========================================");
//     console.log("PUBLIC CONTACT REQUEST");
//     console.log("========================================");

//     console.log("PUBLIC CONTACT BODY:", req.body);
//     console.log("PUBLIC CONTACT FILE:", req.file);

//     const { publicSlug } = req.params;

//     const {    
//       name,     
//       email,     
//       subject,   
//       message,   
//       priority,  
//     } = req.body;
    
    

    

//     if (
//       !name ||
//       !email ||
//       !subject ||
//       !message
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Name, email, subject and message are required",
//       });
//     }

    
    
   

//     const organization =
//       await Organization.findOne({
//         publicSlug: publicSlug.toLowerCase(),
//         status: "Active",
//       });

//     console.log(
//       "FOUND ORGANIZATION:",
//       organization
//     );

//     if (!organization) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Organization not found or inactive",
//       });
//     }

//     console.log(
//       "ORGANIZATION ID:",
//       organization._id  
//     );                  
                        
                        
        
                         
                         
//     const customerName =
//       name.trim();      
                        
//     const customerEmail =
//       email.trim().toLowerCase();
                           
                         
  
                         
                         
//     const contact =      
//       await Contact.create({
//         organization:
//           organization._id,
//         name: customerName,
//         email: customerEmail,
//         subject: subject.trim(),
//         message: message.trim(),
//         priority:
//           priority || "Low",
//         status: "Open",
//         attachment: req.file
//           ? req.file.filename
//           : "",
//       });
//     console.log(
//       "CONTACT CREATED:",
//       contact._id
//     );

    
    

//     let customer =
//       await Customer.findOneAndUpdate(
//         {
//           organization:
//             organization._id,

//           email:
//             customerEmail,
//         },

//         {
//           $set: {
//             name: customerName,

//             lastActivity:
//               new Date(),

//             status: "Active",
//           },

//           $addToSet: {
//             tags: "New Lead",
//           },

//           $setOnInsert: {
//             organization:
//               organization._id,

//             email:
//               customerEmail,

//             points: 0,
//           },
//         },

//         {
//           new: true,
//           upsert: true,
//           runValidators: true,
//           setDefaultsOnInsert: true,
//         }
//       );

//     console.log(
//       "CUSTOMER CREATED / UPDATED:"
//     );

//     console.log(
//       "CUSTOMER ID:",
//       customer._id
//     );

//     console.log(
//       "CUSTOMER ORGANIZATION:",
//       customer.organization
//     );

//     console.log(
//       "CUSTOMER EMAIL:",
//       customer.email 
//     );


  


//     return res.status(201).json({
//       success: true,

//       message:
//         "Enquiry submitted successfully",

//       contact,

//       customer,
//     });

//   } catch (error) { 
//     console.error(
//       "========================================"
//     );

//     console.error(
//       "CREATE PUBLIC CONTACT ERROR:"
//     );

//     console.error(error);

//     console.error(
//       "========================================"
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Failed to submit enquiry",
//     });
//   }
// };


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