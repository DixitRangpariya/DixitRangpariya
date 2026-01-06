const mongoose = require('mongoose');

const operatorPaymentSchema = new mongoose.Schema({
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operator',
        required: [true, 'Operator is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
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
    },
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Billing'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OperatorPayment', operatorPaymentSchema);
