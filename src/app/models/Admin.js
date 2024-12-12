const { name } = require('ejs');
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminID: {
        type: 'string',
        required: [true, 'Please enter a admin ID'],
        unique: true,
    },
    name: {
        type: 'string',
        required: [true, 'Please enter a name'],
    },
    phone: {
        type: 'string',
        required: [true, 'Please enter a phone number'],
        unique: true,
    },
    email: {
        type: 'string',
        required: [true, 'Please enter a email'],
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

const Admin = mongoose.model('admin', adminSchema); // 'admin' is the name of the collection in the database

module.exports = Admin;