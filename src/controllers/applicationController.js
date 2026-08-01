const applicationService = require('../services/applicationService.js');

exports.applyToJob = async (req, res, next) => {
    try {
        const candidateId = req.user.id;
        const { jobId } = req.params;

        const application = await applicationService.applyToJob(jobId, candidateId);

        return res.status(201).json({
            success: true,
            message: 'Applied to job successfully',
            data: application,
        });
    }
    catch (error) {
        return next(error);
    }
};

exports.getMyApplications = async (req, res, next) => {
    try {
        const candidateId = req.user.id;

        const applications = await applicationService.getMyApplications(candidateId);

        return res.status(200).json({
            success: true,
            message: 'Applications fetched successfully',
            data: applications,
        });
    }
    catch (error) {
        return next(error);
    }
};

exports.withdrawApplication = async (req, res, next) => {
    try {
        const candidateId = req.user.id;
        const { id } = req.params;

        const application = await applicationService.withdrawApplication(id, candidateId);

        return res.status(200).json({
            success: true,
            message: 'Application withdrawn successfully',
            data: application,
        });
    }
    catch (error) {
        return next(error);
    }
};