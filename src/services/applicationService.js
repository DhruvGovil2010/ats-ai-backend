const Application = require('../models/Application.js');
const Job = require('../models/Job.js');

exports.applyToJob = async (jobId, candidateId) => {
    const job = await Job.findById(jobId);

    if (!job) {
        const error = new Error('Job not found');
        error.statusCode = 404;
        throw error;
    }

    if (job.status !== 'open') {
        const error = new Error('This job is no longer accepting applications');
        error.statusCode = 400;
        throw error;
    }

    try {
        const application = await Application.create({
            jobId,
            candidateId,
        });

        return application;
    }
    catch (error) {
        if (error.code === 11000) {
            const duplicateError = new Error('You have already applied to this job');
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
};

exports.getMyApplications = async (candidateId) => {
    const applications = await Application.find({ candidateId })
        .populate('jobId', 'title location experienceLevel status')
        .sort({ createdAt: -1 });

    const formattedApplications = applications.map((application) => {
        const applicationObject = application.toObject();

        return {
            ...applicationObject,
            job: applicationObject.jobId,
            jobId: undefined,
        };
    });

    return formattedApplications;
};

exports.withdrawApplication = async (applicationId, candidateId) => {
    const application = await Application.findById(applicationId);

    if (!application) {
        const error = new Error('Application not found');
        error.statusCode = 404;
        throw error;
    }

    if (application.candidateId.toString() !== candidateId.toString()) {
        const error = new Error('You are not authorized to withdraw this application');
        error.statusCode = 403;
        throw error;
    }

    application.status = 'withdrawn';
    await application.save();

    return application;
};