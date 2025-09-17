const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});

blackListTokenSchema.index({ token: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('BlackListToken', blackListTokenSchema);