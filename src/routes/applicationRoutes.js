const express = require('express');
const router = express.Router();

const { applyToJob, getMyApplications, withdrawApplication, getApplicantsForJob, updateApplicationStatus } = require('../controllers/applicationController.js');
const { statusValidator } = require('../validators/applicationValidator.js');
const { verifyJWT } = require('../middleware/authMiddleware.js');
const { requireRole } = require('../middleware/roleMiddleware.js');

router.post('/apply/:jobId', verifyJWT, requireRole('candidate'), applyToJob);
router.get('/my', verifyJWT, requireRole('candidate'), getMyApplications);
router.patch('/withdraw/:id', verifyJWT, requireRole('candidate'), withdrawApplication);

router.get('/job-applicants/:jobId', verifyJWT, requireRole('recruiter'), getApplicantsForJob);
router.patch('/update-status/:id', verifyJWT, requireRole('recruiter'), statusValidator, updateApplicationStatus);

module.exports = router;