const express = require('express');
const router = express.Router();
const StudioPayment = require('../models/StudioPayment');
const Billing = require('../models/Billing');

// CREATE - Add a new payment (Received/Paid)
router.post('/', async (req, res) => {
    try {
        const payment = new StudioPayment(req.body);
        await payment.save();
        res.status(201).json({
            success: true,
            message: 'Studio payment recorded successfully',
            data: payment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error recording studio payment',
            error: error.message
        });
    }
});

// READ - Get payments by Studio ID
router.get('/studio/:studioId', async (req, res) => {
    try {
        const payments = await StudioPayment.find({ studio: req.params.studioId })
            .sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching studio payments',
            error: error.message
        });
    }
});

// LEDGER - Get combined ledger for Studio
router.get('/ledger/:studioId', async (req, res) => {
    try {
        const studioId = req.params.studioId;

        // Fetch all bills (Earnings from Studio)
        const bills = await Billing.find({ studio: studioId })
            .sort({ date: 1 });

        // Fetch all payments (Received from/Paid to Studio)
        const payments = await StudioPayment.find({ studio: studioId })
            .sort({ date: 1 });

        // Calculate Totals
        let totalBilled = 0;
        let totalReceived = 0;
        let totalPaid = 0;

        const earningsList = bills.map(bill => {
            totalBilled += bill.amount;
            return {
                id: bill._id,
                date: bill.date,
                description: bill.event || 'Bill',
                amount: bill.amount,
                type: 'bill' // We billed them
            };
        });

        const paymentsList = payments.map(payment => {
            if (payment.type === 0) { // Received
                totalReceived += payment.amount;
            } else if (payment.type === 1) { // Paid
                totalPaid += payment.amount;
            }
            return {
                id: payment._id,
                date: payment.date,
                description: payment.paymentMode + (payment.type === 1 ? ' (Paid Out)' : ' (Received)'),
                details: payment.note,
                amount: payment.amount,
                type: payment.type === 0 ? 'Received' : 'Paid' // Helper string for display if needed
            };
        });

        // Net Pending = Billed - Received + Paid (if we paid them back, they owe us more? Or wait. 
        // Logic: 
        // Positive Balance = They owe us.
        // Billed: +5000 (They owe 5000)
        // Received: -2000 (They paid 2000, owe 3000)
        // Paid: +1000 (We refunded/paid them 1000, they owe 4000)

        const netPending = totalBilled - totalReceived + totalPaid;

        res.status(200).json({
            success: true,
            studioId,
            totalBilled,
            totalReceived,
            totalPaid,
            netPending,
            ledger: {
                bills: earningsList,
                payments: paymentsList
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching studio ledger',
            error: error.message
        });
    }
});

module.exports = router;
