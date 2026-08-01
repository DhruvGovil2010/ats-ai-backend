const Application = require('../models/Application.js');
const Job = require('../models/Job.js');

const RECRUITER_ALLOWED_STATUSES = ['reviewed', 'shortlisted', 'rejected'];

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

exports.getApplicantsForJob = async (jobId, recruiterId) => {
    const job = await Job.findById(jobId);

    if (!job) {
        const error = new Error('Job not found');
        error.statusCode = 404;
        throw error;
    }

    if (job.postedBy.toString() !== recruiterId.toString()) {
        const error = new Error('You are not authorized to view applicants for this job');
        error.statusCode = 403;
        throw error;
    }

    const applications = await Application.find({ jobId })
        .populate('candidateId', 'name email')
        .sort({ createdAt: -1 });

    const formattedApplications = applications.map((application) => {
        const applicationObject = application.toObject();

        return {
            ...applicationObject,
            candidate: applicationObject.candidateId,
            candidateId: undefined,
        };
    });

    return formattedApplications;
};

exports.updateApplicationStatus = async (applicationId, recruiterId, newStatus) => {
    if (!RECRUITER_ALLOWED_STATUSES.includes(newStatus)) {
        const error = new Error(`Status must be one of: ${RECRUITER_ALLOWED_STATUSES.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    const application = await Application.findById(applicationId);

    if (!application) {
        const error = new Error('Application not found');
        error.statusCode = 404;
        throw error;
    }

    const job = await Job.findById(application.jobId);

    if (!job) {
        const error = new Error('Associated job not found');
        error.statusCode = 404;
        throw error;
    }

    if (job.postedBy.toString() !== recruiterId.toString()) {
        const error = new Error('You are not authorized to update this application');
        error.statusCode = 403;
        throw error;
    }

    application.status = newStatus;
    await application.save();

    return application;
};