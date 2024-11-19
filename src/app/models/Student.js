const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentID: {
        type: 'string',
        required: [true, 'Please enter a student ID'],
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
        lowercase: true
    },
})

const Student = mongoose.model('student', studentSchema); // 'student' is the name of the collection in the database

module.exports = Student;