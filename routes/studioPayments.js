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

// DELETE - Delete a payment by ID
router.delete('/:id', async (req, res) => {
    try {
        const payment = await StudioPayment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Payment deleted successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting payment',
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

// EXPORT - Export ledger for Studio
router.post('/export', async (req, res) => {
    try {
        const { studioId, startDate, endDate } = req.body;

        if (!studioId) {
            return res.status(400).json({
                success: false,
                message: 'Studio ID is required'
            });
        }

        const query = { studio: studioId };

        let rangeDetails = {
            startDate: 'All Time',
            endDate: 'All Time'
        };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate);
                rangeDetails.startDate = startDate;
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1);
                query.date.$lt = end;
                rangeDetails.endDate = endDate;
            }
        }

        // Fetch all bills (Billed)
        const bills = await Billing.find(query)
            .sort({ date: 1 });

        // Fetch all payments (Received/Paid)
        const payments = await StudioPayment.find(query)
            .sort({ date: 1 });

        // Calculate Totals and Separate Lists
        let totalBilled = 0;
        let totalReceived = 0;
        let totalPaid = 0;

        const billedList = bills.map(bill => {
            totalBilled += bill.amount;
            return {
                date: bill.date,
                description: bill.event || 'Bill',
                amount: bill.amount
            };
        });

        const receivedList = [];
        const paidList = [];

        payments.forEach(payment => {
            const item = {
                date: payment.date,
                paymentMode: payment.paymentMode,
                note: payment.note,
                amount: payment.amount
            };

            if (payment.type === 0) { // Received
                totalReceived += payment.amount;
                receivedList.push(item);
            } else if (payment.type === 1) { // Paid
                totalPaid += payment.amount;
                paidList.push(item);
            }
        });

        const netPending = totalBilled - totalReceived + totalPaid;

        res.status(200).json({
            success: true,
            dateRange: rangeDetails,
            totalBilled,
            totalReceived,
            totalPaid,
            netPending,
            billed: billedList,
            received: receivedList,
            paid: paidList
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error exporting studio ledger',
            error: error.message
        });
    }
});

module.exports = router;
