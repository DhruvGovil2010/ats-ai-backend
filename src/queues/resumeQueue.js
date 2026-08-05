const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const env = require('../config/env.js');

const connection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

const resumeQueue = new Queue('resume-processing', { connection });

exports.addResumeJob = async (data) => {
    const job = await resumeQueue.add('parse-resume', data);
    return job;
};

exports.resumeQueue = resumeQueue;