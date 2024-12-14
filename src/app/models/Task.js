const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    pCourseID: {
        type: 'string',
        required: [true, 'Please enter a course ID'],
        lowercase: true
    },
    title: {
        type: 'string',
        required: [true, 'Please enter a title']
    },
    description: {
        type: 'string'
    },
    taskType: {
        type: 'string',
        required: [true, 'Please enter a task type']
    },
    assignedBy: {
        type: 'string',
        required: [true, 'Please enter the name of the person who assigned the task']
    },
    dueDate: {
        type: Date,
        required: [true, 'Please enter a due date']
    },
    createdAt: {
        type: Date,
        required: [true, 'Please enter a creation date'],
    },
    updateAt: {
        type: Date,
    }
});

const Task = mongoose.model('task', taskSchema); // 'task' is the name of the collection in the database

module.exports = Task;