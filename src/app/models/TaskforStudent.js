const mongoose = require('mongoose');

const taskforStudentSchema = new mongoose.Schema({
    studentID: {
        type: 'string',
        required: [true, 'Please enter a student ID'],
        lowercase: true
    },
    taskID: {
        type: 'string',
        required: [true, 'Please enter a task ID'],
        lowercase: true
    },
    status: {
        type: 'string',
        required: [true, 'Please enter a status']
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    grade: {
        type: 'number',
        default: 0
    },
});

const TaskforStudent = mongoose.model('taskforstudent', taskforStudentSchema); // 'taskforstudent' is the name of the collection in the database

module.exports = TaskforStudent;