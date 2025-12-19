const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
    studioName: {
        type: String,
        required: [true, 'Studio name is required'],
        trim: true
    },
    studioLocation: {
        type: String,
        required: [true, 'Studio location is required'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Studio', studioSchema);
