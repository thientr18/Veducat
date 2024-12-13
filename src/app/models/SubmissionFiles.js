const mongoose = require('mongoose');

const submissionFilesSchema = new mongoose.Schema({
    submissionID: {
        type: 'string',
        required: [true, 'Please enter a material ID'],
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

const SubmissionFiles = mongoose.model('submissionFiles', submissionFilesSchema); // 'SubmissionFile' is the name of the collection in the database
module.exports = SubmissionFiles;