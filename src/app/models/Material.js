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