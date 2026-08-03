const Job = require('../models/Job.js');
const redisClient = require('../config/redis.js');

const CACHE_TTL_SECONDS = 60;

const buildSearchCacheKey = ({ skills, location, experienceLevel, cursor, limit }) => {
    const filters = { skills, location, experienceLevel, cursor, limit };

    const keyParts = Object.keys(filters)
        .filter((key) => filters[key])
        .sort()
        .map((key) => `${key}=${filters[key]}`);

    return `jobsearch:${keyParts.join(':')}`;
};

const clearSearchCache = async () => {
    const keys = await redisClient.keys('jobsearch:*');

    if (keys.length > 0) {
        await redisClient.del(...keys);
    }
};

exports.createJob = async (jobData, recruiterId) => {
    const job = await Job.create({
        ...jobData,
        postedBy: recruiterId,
    });

    await clearSearchCache();

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

    await clearSearchCache();

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

    await clearSearchCache();

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
    const cacheKey = buildSearchCacheKey({ skills, location, experienceLevel, cursor, limit });

    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
        return JSON.parse(cachedResult);
    }

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

    const result = { jobs, nextCursor };

    await redisClient.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL_SECONDS);

    return result;
};
