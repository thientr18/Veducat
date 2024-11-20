const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    courseID: {
        type: 'string',
        required: [true, 'Please enter a course ID'],
        lowercase: true
    },
    title: {
        type: 'string',
        required: [true, 'Please enter a title']
    },
    content: {
        type: 'string',
        required: [true, 'Please enter a content']
    },
    recipents: {
        type: Array,
        default: [
            {
                recipentID: {
                    type: 'string',
                    required: [true, 'Please enter a recipent ID'],
                    lowercase: true
                }
            }
        ],
    },
    senderID: {
        type: 'string',
        required: [true, 'Please enter a sender ID'],
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