const mongoose = require('mongoose');

const progressingCourseSchema = new mongoose.Schema({
    courseID: {
        type: 'string',
        required: [true, 'Please enter a course ID'],
        lowercase: true
    },
    teacherID: {
        type: 'string',
        required: [true, 'Please enter a teacher ID'],
        lowercase: true
    },
    students: {
        type: [String],
        default: [],
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

const ProgressingCourse = mongoose.model('progressingCourse', progressingCourseSchema); // 'course' is the name of the collection in the database

module.exports = ProgressingCourse;