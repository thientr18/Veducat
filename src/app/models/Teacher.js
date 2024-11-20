const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacherID: {
        type: 'string',
        required: [true, 'Please enter a teacher ID'],
        unique: true,
        lowercase: true
    },
    name: {
        type: 'string',
        required: [true, 'Please enter a name'],
    },
    majorID: {
        type: 'string',
        required: [true, 'Please enter a major ID'],
        lowercase: true
    },
    departmentID: {
        type: 'string',
        required: [true, 'Please enter a department ID'],
        lowercase: true
    },
    DoB: {
        type: Date,
    },
    phone: {
        type: 'string',
        lowercase: true
    },
    email: {
        type: 'string',
        required: [true, 'Please enter an email'],
        lowercase: true,
        isEmail: true,
        unique: true,
    },
});

const Teacher = mongoose.model('teacher', teacherSchema); // 'teacher' is the name of the collection in the database

module.exports = Teacher;