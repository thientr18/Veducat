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
})

const Student = mongoose.model('student', studentSchema); // 'student' is the name of the collection in the database

module.exports = Student;