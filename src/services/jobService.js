const Job = require('../models/Job.js');

exports.createJob = async (jobData, recruiterId) => {
    const job = await Job.create({
        ...jobData,
        postedBy: recruiterId,
    });

    return job;
};

exports.updateJob = async (jobId, recruiterId, updates) => {
    const job = await Job.findById(jobId);

    if (!job) {
        const error = new Error('Job not found');
        error.statusCode = 404;
        throw error;
    }

    if (job.postedBy.toString() !== recruiterId.toString()) {
        const error = new Error('You are not authorized to edit this job');
        error.statusCode = 403;
        throw error;
    }

    Object.assign(job, updates);
    await job.save();

    return job;
};

exports.closeJob = async (jobId, recruiterId) => {
    const job = await Job.findById(jobId);

    if (!job) {
        const error = new Error('Job not found');
        error.statusCode = 404;
        throw error;
    }

    if (job.postedBy.toString() !== recruiterId.toString()) {
        const error = new Error('You are not authorized to close this job');
        error.statusCode = 403;
        throw error;
    }

    job.status = 'closed';
    await job.save();

    return job;
};

exports.getJobById = async (jobId) => {
    const job = await Job.findOneAndUpdate(
        { _id: jobId },
        { $inc: { viewCount: 1 } },
        { new: true }
    );

    if (!job) {
        const error = new Error('Job not found');
        error.statusCode = 404;
        throw error;
    }

    return job;
};