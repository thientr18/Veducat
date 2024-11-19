const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseID: {
        type: 'string',
        required: [true, 'Please enter a course ID'],
        unique: true,
        lowercase: true
    },
    name: {
        type: 'string',
        required: [true, 'Please enter a name'],
        lowercase: true
    },
    description: {
        type: 'string',
        required: [true, 'Please enter a description'],
        lowercase: true
    },
    teacherID: {
        type: 'string',
        required: [true, 'Please enter a teacher ID'],
        lowercase: true
    },
    students: {
        type: Array,
        default: []
    }
});

const Course = mongoose.model('course', courseSchema); // 'course' is the name of the collection in the database

module.exports = Course;