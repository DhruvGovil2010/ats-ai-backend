const ALLOWED_STATUS_UPDATES = ['reviewed', 'shortlisted', 'rejected'];

exports.statusValidator = (req, res, next) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'status is required',
        });
    }

    if (typeof status !== 'string' || !ALLOWED_STATUS_UPDATES.includes(status.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: `status must be one of: ${ALLOWED_STATUS_UPDATES.join(', ')}`,
        });
    }

    req.body.status = status.toLowerCase();
    next();
};