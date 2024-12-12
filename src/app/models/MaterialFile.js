const mongoose = require('mongoose');

const materialFileSchema = new mongoose.Schema({
    materialID: {
        type: 'string',
        required: [true, 'Please enter a material ID'],
        lowercase: true,
    },
    materialName: {
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

const MaterialFile = mongoose.model('materialFile', materialFileSchema); // 'materialFile' is the name of the collection in the database
module.exports = MaterialFile;