const organizationMiddleware = (req, res, next) => {
  try {
    const requestedOrganizationId =
      req.params.organizationId;

    const loggedInOrganizationId =
      req.user.organizationId;

    if (!loggedInOrganizationId) {
      return res.status(403).json({
        success: false,
        message: "User is not linked to an organization",
      });
    }

    if (
      requestedOrganizationId !==
      loggedInOrganizationId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot access another organization",
      });
    }

    next();

  } catch (error) {
    console.error(
      "Organization middleware error:",
      error
    );

    return res.status(403).json({
      success: false,
      message: "Organization access denied",
    });
  }
};

module.exports = organizationMiddleware;