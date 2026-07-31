exports.requireRole = (...allowedRoles) => (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
        return res.status(401).json({
            success: false,
            message: 'User role not found, authentication required',
        });
    }

    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to perform this action',
        });
    }

    return next();
};