const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    discussionID: {
        type: 'string',
        required: [true, 'Please enter a submission ID'],
        lowercase: true
    },
    discussionContent: {
        type: 'string',
        required: [true, 'Please enter a task ID'],
        lowercase: true
    },
    studentID: {
        type: 'string',
        required: [true, 'Please enter a student ID']
    },
    grade: {
        type: 'number',
        required: [true, 'Please enter a grade']
    },
    gradedBy: {
        type: 'string',
        required: [true, 'Please enter the name of the person who graded the submission']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Grade = mongoose.model('grade', gradeSchema); // 'grade' is the name of the collection in the database

module.exports = Grade;