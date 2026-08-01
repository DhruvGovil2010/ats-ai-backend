const express = require('express');
const router = express.Router();

const { createJob, updateJob, updateJobStatus, getJobById, searchJobs } = require('../controllers/jobController.js');
const { createJobValidator, updateJobValidator } = require('../validators/jobValidator.js');
const { verifyJWT } = require('../middleware/authMiddleware.js');
const { requireRole } = require('../middleware/roleMiddleware.js');

router.post('/create', verifyJWT, requireRole('recruiter'), createJobValidator, createJob);
router.put('/update/:id', verifyJWT, requireRole('recruiter'), updateJobValidator, updateJob);
router.patch('/update-status/:id', verifyJWT, requireRole('recruiter'), updateJobStatus);
router.get('/search', searchJobs);
router.get('/:id', getJobById);

module.exports = router;