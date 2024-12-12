const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    taskID: {
        type: 'string',
        required: [true, 'Please enter a task ID'],
        lowercase: true
    },
    studentID: {
        type: 'string',
        required: [true, 'Please enter a student ID'],
        lowercase: true
    },
    description: {
        type: 'string',
        required: [true, 'Please enter a description']
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
                    required: [true, 'Please enter a status']
                }
            }
        ],
    },
    graded: {
        type: 'boolean',
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

const Submission = mongoose.model('submission', submissionSchema); // 'submission' is the name of the collection in the database

module.exports = Submission;