const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    taskID: {
        type: 'string',
        required: [true, 'Please enter a task ID'],
        lowercase: true
    },
    taskName: {
        type: 'string',
        required: [true, 'Please enter a material name'],
        lowercase: true,
    },
    studentID: {
        type: 'string',
        required: [true, 'Please enter a student ID'],
        lowercase: true
    },
    description: {
        type: 'string',
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Array,
        default: [
            {
                type: {
                    type: 'string',
                }
            }
        ],
    },
    tagSubmit:{
        type: 'string',
        default: 'Submitted'
    },
    graded: {
        type: 'boolean',
        default: false
    }
});

const Submission = mongoose.model('submission', submissionSchema); // 'submission' is the name of the collection in the database

module.exports = Submission;