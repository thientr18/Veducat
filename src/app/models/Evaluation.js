const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    courseID: {
        type: 'string',
        required: [true, 'Please enter a course ID'],
        lowercase: true
    },
    studentID: {
        type: 'string',
        required: [true, 'Please enter a student ID'],
        lowercase: true
    },
    rating: {
        type: 'number',
        required: [true, 'Please enter a rating']
    },
    feedback: {
        type: 'string'
    },
    evaluationDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Evaluation = mongoose.model('evaluation', evaluationSchema); // 'evaluation' is the name of the collection in the database

module.exports = Evaluation;