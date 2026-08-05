const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const env = require('../config/env.js');

const connection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

const resumeWorker = new Worker(
    'resume-processing',
    async (job) => {
        console.log(`Processing job ${job.id} with data:`, job.data);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log(`Finished processing job ${job.id}`);

        return { status: 'processed', receivedAt: job.data.timestamp };
    },
    { connection }
);

resumeWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

resumeWorker.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed:`, error.message);
});

console.log('Resume worker is running and listening for jobs...');