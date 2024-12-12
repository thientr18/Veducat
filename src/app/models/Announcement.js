const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    pCourseID: {
        type: 'string',
        lowercase: true,
    },
    title: {
        type: 'string',
        required: [true, 'Please enter a title']
    },
    content: {
        type: 'string',
        required: [true, 'Please enter a content']
    },
    receivers: {
        type: [String],
        default: [],
        required: [true, 'Please enter a receivers ID']
    },
    senderID: {
        type: 'string',
        required: [true, 'Please enter a sender ID'],
        lowercase: true
    },
    type: {
        type: 'string',
        required: [true, 'Please enter a type'],
        lowercase: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Announcement = mongoose.model('announcement', announcementSchema); // 'announcement' is the name of the collection in the database

module.exports = Announcement;