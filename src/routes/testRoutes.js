const express = require('express');
const router = express.Router();

const { addResumeJob } = require('../queues/resumeQueue.js');

router.post('/queue-job', async (req, res, next) => {
    try {
        const job = await addResumeJob({
            test: true,
            timestamp: Date.now(),
        });

        return res.status(200).json({
            success: true,
            message: 'Test job added to queue',
            data: { jobId: job.id },
        });
    }
    catch (error) {
        return next(error);
    }
});

module.exports = router;