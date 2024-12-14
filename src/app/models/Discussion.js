const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
    pCourseID: {
        type: 'string',
        required: [true, 'Please enter a course ID'],
        lowercase: true
    },
    title:{
        type: 'string',
        required: [true, 'Please enter a title']
    },
    topic: {
        type: 'string',
        required: [true, 'Please enter a topic']
    },
    description: {
        type: 'string',
    },
    // participants: {
    //     type: Array,
    //     default: [
    //         {
    //             participantID: {
    //                 type: 'string',
    //                 // required: [true, 'Please enter a participant ID'],
    //                 lowercase: true
    //             },
    //             joined: {
    //                 default: false,
    //             }
    //         }
    //     ],
    // },
    uploadedBy: {
        type: 'string',
        required: [true, 'Please enter a user ID'],
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Discussion = mongoose.model('discussion', discussionSchema); // 'discussion' is the name of the collection in the database

module.exports = Discussion;