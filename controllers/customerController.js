const Customer = require("../models/Customer");

// ========================================
// GET ORGANIZATION CUSTOMERS
// ========================================

// exports.getOrganizationCustomers = async (req, res) => {
//   try {
//     // Get organization from JWT
//     const organizationId =
//       req.user?.organizationId;

//     console.log(
//       "CUSTOMER API - USER:",
//       req.user
//     );

//     console.log(
//       "CUSTOMER API - ORGANIZATION ID:",
//       organizationId
//     );

//     // Check organization
//     if (!organizationId) {
//       return res.status(403).json({
//         success: false,
//         message: "Organization not assigned",
//       });
//     }

//     // Get customers belonging to
//     // logged-in organization
//     const customers = await Customer.find({
//       organization: organizationId,
//     })
//       .select(
//         "name email tags lastActivity status"
//       )
//       .sort({
//         createdAt: -1,
//       });

//     console.log(
//       "CUSTOMER API - CUSTOMERS:",
//       customers
//     );

//     console.log(
//       "CUSTOMER API - COUNT:",
//       customers.length
//     );

//     return res.status(200).json({
//       success: true,
//       customers,
//     });

//   } catch (error) {
//     console.error(
//       "GET ORGANIZATION CUSTOMERS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


// ========================================
// GET ORGANIZATION CUSTOMERS              
// ========================================



exports.getOrganizationCustomers = async (req, res) => {
  try {
    const organizationId =
      req.user?.organizationId;

    console.log(
      "ORGANIZATION ID:",
      organizationId
    );

    if (!organizationId) {
      return res.status(403).json({
        success: false,
        message: "Organization not assigned",
      });
    }

    const customers =
      await Customer.find({
        organization: organizationId,
      }).sort({
        createdAt: -1,
      });

    console.log(
      "MATCHED CUSTOMERS:",
      customers.length
    );

    console.log(
      "MATCHED CUSTOMER DATA:",
      customers
    );

    return res.status(200).json({
      success: true,
      customers,
    });

  } catch (error) {
    console.error(
      "GET ORGANIZATION CUSTOMERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// CREATE CUSTOMER


exports.createCustomer = async (req, res) => {
  try {
    const organizationId =
      req.user?.organizationId;

    console.log(
      "CREATE CUSTOMER - ORGANIZATION ID:",
      organizationId
    );

    
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
        message:
          "Customer name is required",
      });
    }

    
    const customer =
      await Customer.create({
        organization: organizationId,
        name,
        email,
        phone,
        company,
        status: status || "Active",
      });

    return res.status(201).json({
      success: true,
      message:
        "Customer created successfully",
      customer,
    });

  } catch (error) {
    console.error(
      "CREATE CUSTOMER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};