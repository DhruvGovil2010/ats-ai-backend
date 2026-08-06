const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const IORedis = require('ioredis');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env.js');
const { RESUME_PARSE_PROMPT } = require('../config/aiPrompts.js');
const Application = require('../models/Application.js');

const connection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

mongoose.connect(env.MONGO_URI)
    .then(() => console.log('Worker connected to MongoDB'))
    .catch((error) => console.error('Worker MongoDB connection failed:', error.message));

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const resumeWorker = new Worker(
    'resume-processing',
    async (job) => {
        const { applicationId, resumeFileUrl } = job.data;

        console.log(`Processing job ${job.id} for application ${applicationId}`);

        const fileBuffer = fs.readFileSync(resumeFileUrl);
        const parsedPdf = await pdfParse(fileBuffer);
        const resumeText = parsedPdf.text;

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: RESUME_PARSE_PROMPT + resumeText,
        });

        const rawOutput = response.text.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(rawOutput);

        await Application.findByIdAndUpdate(applicationId, {
            parsedResumeData: parsedData,
            status: 'parsed',
        });

        console.log(`Finished processing job ${job.id}`);

        return { status: 'processed', applicationId };
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