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
    DoB: {
        type: Date,
    },
    phone: {
        type: 'string',
        lowercase: true
    },
    email: { // email = ID+@student.hcmiu.edu.vn
        type: 'string',
        required: [true, 'Please enter an email'],
        lowercase: true,
        isEmail: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
})

const Student = mongoose.model('student', studentSchema); // 'student' is the name of the collection in the database

module.exports = Student;