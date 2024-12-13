const mongoose = require('mongoose');

const discussionFilesSchema = new mongoose.Schema({
    discussionID: {
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

const DiscussionFiles = mongoose.model('discussionFiles', discussionFilesSchema); // 'SubmissionFile' is the name of the collection in the database
module.exports = DiscussionFiles;