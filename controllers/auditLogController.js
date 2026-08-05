const AuditLog = require("../models/AuditLog");




exports.getAuditLogs = async (req, res) => {
  try {

    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .populate(
        "organization",
        "organizationName type"
      )
      .sort({
        createdAt: -1,
      });


    res.json({
      success: true,
      logs,
    });

  } catch (error) {

    console.error(
      "GET AUDIT LOGS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};