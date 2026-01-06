const express = require('express');
const router = express.Router();
const OperatorPayment = require('../models/OperatorPayment');
const Billing = require('../models/Billing');

// CREATE - Add a new payment
router.post('/', async (req, res) => {
    try {
        const payment = new OperatorPayment(req.body);
        await payment.save();
        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            data: payment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error recording payment',
            error: error.message
        });
    }
});

// READ - Get payments by Operator ID
router.get('/operator/:operatorId', async (req, res) => {
    try {
        const payments = await OperatorPayment.find({ operator: req.params.operatorId })
            .sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payments',
            error: error.message
        });
    }
});

// LEDGER - Get combined ledger for Operator
router.get('/ledger/:operatorId', async (req, res) => {
    try {
        const operatorId = req.params.operatorId;

        // Fetch all bills (Earnings)
        const bills = await Billing.find({ operator: operatorId })
            .populate('studio', 'studioName')
            .sort({ date: 1 });

        // Fetch all payments (Paid)
        const payments = await OperatorPayment.find({ operator: operatorId })
            .sort({ date: 1 });

        // Calculate Totals
        let totalEarnings = 0;
        let totalPaid = 0;

        const earningsList = bills.map(bill => {
            const amount = bill.operatorAmount || 0; // Use operatorAmount if exists
            totalEarnings += amount;
            return {
                id: bill._id,
                date: bill.date,
                description: bill.event || 'Bill',
                studio: bill.studio ? bill.studio.studioName : 'Unknown',
                amount: amount,
                type: 'credit' // We owe them
            };
        });

        const paymentsList = payments.map(payment => {
            totalPaid += payment.amount;
            return {
                id: payment._id,
                date: payment.date,
                description: payment.paymentMode,
                details: payment.note,
                amount: payment.amount,
                type: 'debit' // We paid them
            };
        });

        const pendingBalance = totalEarnings - totalPaid;

        res.status(200).json({
            success: true,
            operatorId,
            totalEarnings,
            totalPaid,
            pendingBalance,
            ledger: {
                earnings: earningsList,
                payments: paymentsList
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error local fetching ledger',
            error: error.message
        });
    }
});

module.exports = router;
