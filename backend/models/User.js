const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);