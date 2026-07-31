const jobService = require('../services/jobService.js');

exports.createJob = async (req, res, next) => {
    try {
        const recruiterId = req.user.id;

        const job = await jobService.createJob(req.body, recruiterId);

        return res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: job,
        });
    }
    catch (error) {
        return next(error);
    }
};

exports.updateJob = async (req, res, next) => {
    try {
        const recruiterId = req.user.id;
        const { id } = req.params;

        const job = await jobService.updateJob(id, recruiterId, req.body);

        return res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: job,
        });
    }
    catch (error) {
        return next(error);
    }
};

exports.closeJob = async (req, res, next) => {
    try {
        const recruiterId = req.user.id;
        const { id } = req.params;

        const job = await jobService.closeJob(id, recruiterId);

        return res.status(200).json({
            success: true,
            message: 'Job closed successfully',
            data: job,
        });
    }
    catch (error) {
        return next(error);
    }
};

exports.getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const job = await jobService.getJobById(id);

        return res.status(200).json({
            success: true,
            message: 'Job fetched successfully',
            data: job,
        });
    }
    catch (error) {
        return next(error);
    }
};