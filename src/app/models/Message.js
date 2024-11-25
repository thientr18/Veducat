const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    discussionID: {
        type: 'string',
        required: [true, 'Please enter a discussion ID'],
        lowercase: true
    },
    senderID: {
        type: 'string',
        required: [true, 'Please enter a sender ID'],
        lowercase: true
    },
    message: {
        type: 'string',
        required: [true, 'Please enter a message']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model('message', MessageSchema); // 'message' is the name of the collection in the database

module.exports = Message;