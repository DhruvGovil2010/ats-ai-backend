const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: [String],
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    salaryRange: {
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior'],
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    viewCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true }
);

jobSchema.index({ skillsRequired: 1, location: 1, experienceLevel: 1 });

module.exports = mongoose.model('Job', jobSchema);