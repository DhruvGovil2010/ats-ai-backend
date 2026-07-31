const express = require('express');
const router = express.Router();

const { createJob, updateJob, closeJob, getJobById, searchJobs } = require('../controllers/jobController.js');
const { createJobValidator, updateJobValidator } = require('../validators/jobValidator.js');
const { verifyJWT } = require('../middleware/authMiddleware.js');
const { requireRole } = require('../middleware/roleMiddleware.js');

router.post('/create', verifyJWT, requireRole('recruiter'), createJobValidator, createJob);
router.put('/update/:id', verifyJWT, requireRole('recruiter'), updateJobValidator, updateJob);
router.patch('/close/:id', verifyJWT, requireRole('recruiter'), closeJob);
router.get('/search', searchJobs);
router.get('/:id', getJobById);

module.exports = router;