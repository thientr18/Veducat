const mongoose = require('mongoose');

const taskFileSchema = new mongoose.Schema({
    taskID: {
        type: 'string',
        required: [true, 'Please enter a material ID'],
        lowercase: true,
    },
    taskName: {
        type: 'string',
        required: [true, 'Please enter a material name'],
        lowercase: true,
    },
    fileName: {
        type: 'string',
    },
    filePath: {
        type: 'string',
    },
    fileType: {
        type: 'string',
 
    },
    fileSize: {
        type: 'number',
    }
});

const TaskFile = mongoose.model('taskFile', taskFileSchema); // 'taskFile' is the name of the collection in the database
module.exports = TaskFile;