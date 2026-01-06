const mongoose = require('mongoose');

const studioPaymentSchema = new mongoose.Schema({
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: [true, 'Studio is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    type: {
        type: Number,
        default: 0, // 0: Received, 1: Paid
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Online', 'GPay', 'PhonePe', 'Bank Transfer', 'Cheque', 'Other'],
        default: 'Cash'
    },
    note: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StudioPayment', studioPaymentSchema);
