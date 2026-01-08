const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        trim: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operator',
        required: [true, 'Operator is required']
    },
    otherOperator: {
        type: String,
        trim: true
    },
    operatorAmount: {
        type: Number
    },
    place: {
        type: String,
        trim: true
    },
    event: {
        type: String,
        trim: true
    },
    paymentStatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Billing', billingSchema);
