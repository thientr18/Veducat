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
        required: [true, 'Please enter a name']
    },
    teacherID: {
        type: 'string',
        required: [true, 'Please enter a teacher ID'],
        lowercase: true
    },
    students: {
        type: Array,
        default: [
            {
                studentID: {
                    type: 'string',
                    required: [true, 'Please enter a student ID'],
                    lowercase: true
                }
            }
        ],
    },
    description: {
        type: 'string',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Course = mongoose.model('course', courseSchema); // 'course' is the name of the collection in the database

module.exports = Course;