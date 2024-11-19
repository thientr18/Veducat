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
        lowercase: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please enter a date of birth'],
    },
    email: {
        type: 'string',
        required: [true, 'Please enter an email'],
        lowercase: true
    },
    phone: {
        type: 'string',
        required: [true, 'Please enter a phone number'],
        lowercase: true
    },
});

const Teacher = mongoose.model('teacher', teacherSchema); // 'teacher' is the name of the collection in the database

module.exports = Teacher;