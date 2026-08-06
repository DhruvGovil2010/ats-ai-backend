const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'parsed', 'parse_failed', 'reviewed', 'shortlisted', 'rejected', 'withdrawn'],
        default: 'pending',
    },
    resumeFileUrl: {
        type: String,
    },
    parsedResumeData: {
        type: mongoose.Schema.Types.Mixed,
    },
    parsedAt: {
        type: Date,
    },
}, { timestamps: true }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);