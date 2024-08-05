const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    case_id: {
        type: String,
        required: true,
        unique: true
    },
    roblox_username: {
        type: String,
        required: true
    },
    discord_username: {
        type: String,
        required: true
    },
    offense: {
        type: String,
        required: true
    },
    case_link: {
        type: String,
        default: 'N/A'
    },
    punishment: {
        type: String,
        required: true
    },
    background: {
        type: String,
        required: true
    },
    in_person_or_discord: {
        type: String,
        required: true
    },
    deserved_or_not: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'DENIED', 'PENDING APPROVAL FROM COA COMMAND', 'ON HOLD', 'AWAITING ASSIGNMENT', 'ASSIGNED', 'COMPLETED'],
        default: 'PENDING'
    },
    judges_assigned: {
        type: Boolean,
        default: false
    },
    judges_username: {
        type: String,
        default: 'N/A'
    },
    submitted_date: {
        type: Date,
        default: Date.now
    },
    decline_reason: {
        type: String,
        default: 'N/A'
    },
    branch: {
        type: String,
        enum: ['Military', 'Government', 'Both', 'Other'],
        required: true
    }
});

const case_list = mongoose.model('Case', caseSchema);
module.exports = case_list;
