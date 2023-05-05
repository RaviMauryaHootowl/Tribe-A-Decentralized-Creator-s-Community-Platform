const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creatorSchema = new Schema({
    emailId: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    description: {
        type: String
    },
    socialUrl: {
        type: String
    },
    isVotingLive: {
        type: Boolean,
        default: false
    },
    projects: [{
        projectName: String,
        projectDescription: String,
        projectCover: String,
    }],
    members: [{
        emailId: String
    }]
});

module.exports = mongoose.model('Creator', creatorSchema);