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

exports.updateJobStatus = async (jobId, recruiterId) => {
    const job = await Job.findById(jobId);

    if (!job) {
        const error = new Error('Job not found');
        error.statusCode = 404;
        throw error;
    }

    const jobStatus = job.status;

    if (job.postedBy.toString() !== recruiterId.toString()) {

        let er = `You are not authorized to close this job`;
        if (jobStatus === 'closed') {
            er = `You are not authorized to open this job`;
        }

        const error = new Error(er);
        error.statusCode = 403;
        throw error;
    }

    job.status = jobStatus === 'closed' ? 'open' : 'closed';
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

exports.searchJobs = async ({ skills, location, experienceLevel, cursor, limit }) => {
    const query = { status: 'open' };

    if (skills) {
        const skillsArray = skills.split(',').map((skill) => skill.trim());
        query.skillsRequired = { $in: skillsArray };
    }

    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    if (experienceLevel) {
        query.experienceLevel = experienceLevel.toLowerCase();
    }

    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }

    const pageLimit = Math.min(parseInt(limit, 10) || 10, 50);

    const jobs = await Job.find(query)
        .sort({ createdAt: -1 })
        .limit(pageLimit);

    const nextCursor = jobs.length === pageLimit
        ? jobs[jobs.length - 1].createdAt
        : null;

    return {
        jobs,
        nextCursor,
    };
};
