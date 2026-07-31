const ALLOWED_EXPERIENCE_LEVELS = ['entry', 'mid', 'senior'];

exports.createJobValidator = (req, res, next) => {
    const { title, description, skillsRequired, location, experienceLevel } = req.body;

    if (!title || !description || !skillsRequired || !location || !experienceLevel) {
        return res.status(400).json({
            success: false,
            message: 'title, description, skillsRequired, location and experienceLevel are required',
        });
    }

    if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof location !== 'string' ||
        typeof experienceLevel !== 'string'
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid field types',
        });
    }

    if (title.trim() === '' || description.trim() === '' || location.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Fields cannot be empty',
        });
    }

    if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'skillsRequired must be a non-empty array of strings',
        });
    }

    const hasInvalidSkill = skillsRequired.some((skill) => typeof skill !== 'string' || skill.trim() === '');
    if (hasInvalidSkill) {
        return res.status(400).json({
            success: false,
            message: 'Each skill in skillsRequired must be a non-empty string',
        });
    }

    if (!ALLOWED_EXPERIENCE_LEVELS.includes(experienceLevel.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: `experienceLevel must be one of: ${ALLOWED_EXPERIENCE_LEVELS.join(', ')}`,
        });
    }

    req.body.experienceLevel = experienceLevel.toLowerCase();
    next();
};

exports.updateJobValidator = (req, res, next) => {
    const { experienceLevel } = req.body;

    if (experienceLevel !== undefined) {
        if (typeof experienceLevel !== 'string' || !ALLOWED_EXPERIENCE_LEVELS.includes(experienceLevel.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `experienceLevel must be one of: ${ALLOWED_EXPERIENCE_LEVELS.join(', ')}`,
            });
        }
        req.body.experienceLevel = experienceLevel.toLowerCase();
    }

    next();
};