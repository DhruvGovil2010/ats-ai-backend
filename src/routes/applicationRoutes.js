const express = require('express');
const router = express.Router();

const { applyToJob, getMyApplications, withdrawApplication } = require('../controllers/applicationController.js');
const { verifyJWT } = require('../middleware/authMiddleware.js');
const { requireRole } = require('../middleware/roleMiddleware.js');

router.post('/apply/:jobId', verifyJWT, requireRole('candidate'), applyToJob);
router.get('/my', verifyJWT, requireRole('candidate'), getMyApplications);
router.patch('/withdraw/:id', verifyJWT, requireRole('candidate'), withdrawApplication);

module.exports = router;