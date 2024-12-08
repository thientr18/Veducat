const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    courseID: {
        type: 'string',
        required: [true, 'Please enter a course ID'],
        lowercase: true,
    },
    title: {
        type: 'string',
        required: [true, 'Please enter a title']
    },
    description: {
        type: 'string'
    },
    filePath: {
        type: 'string',
        required: [true, 'Please enter a file path']
    },
    fileType: {
        type: 'string',
        required: [true, 'Please enter a file type']
    },
    fileSize: {
        type: 'number',
        required: [true, 'Please enter a file size']
    },
    uploadedBy: {
        type: 'string',
        required: [true, 'Please enter the uploader ID'],
        lowercase: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
});

const Material = mongoose.model('material', materialSchema); // 'material' is the name of the collection in the database

module.exports = Material;