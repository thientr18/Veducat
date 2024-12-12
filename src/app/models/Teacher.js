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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

const Teacher = mongoose.model('teacher', teacherSchema); // 'teacher' is the name of the collection in the database

module.exports = Teacher;