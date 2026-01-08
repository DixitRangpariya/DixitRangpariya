const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const OperatorPayment = require('../models/OperatorPayment');
const StudioPayment = require('../models/StudioPayment');

// CREATE - Add a new billing entry
router.post('/', async (req, res) => {
    try {
        const billing = new Billing(req.body);
        await billing.save();
        res.status(201).json({
            success: true,
            message: 'Billing entry created successfully',
            data: billing
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating billing entry',
            error: error.message
        });
    }
});

// READ - Get all billing entries
router.get('/', async (req, res) => {
    try {
        const billings = await Billing.find()
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation');
        res.status(200).json({
            success: true,
            count: billings.length,
            data: billings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching billing entries',
            error: error.message
        });
    }
});

// READ - Get billing entries by Studio ID Wise
router.get('/studio/:studioId', async (req, res) => {
    try {
        const billings = await Billing.find({ studio: req.params.studioId })
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation');

        // Calculate totals from Ledger
        let totalBilled = 0;

        billings.forEach(billing => {
            totalBilled += billing.amount;
        });

        // Get payments from StudioPayment
        const payments = await StudioPayment.find({ studio: req.params.studioId });
        let totalReceived = 0;
        let totalPaid = 0
        payments.forEach(payment => {
            if (payment.type === 0) { // Received
                totalReceived += payment.amount;
            } else if (payment.type === 1) { // Paid
                totalPaid += payment.amount;
            }
        });

        // Net Pending = Billed - Received + Paid (Positive means they owe us)
        const netPending = totalBilled - totalReceived + totalPaid;

        res.status(200).json({
            success: true,
            count: billings.length,
            totalBilled,
            totalReceived,
            totalPaid,
            netPending,
            data: billings,
            payments // Optional
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching billing entries for studio',
            error: error.message
        });
    }
});

// READ - Get billing entries by Operator ID
router.get('/operator/:operatorId', async (req, res) => {
    try {
        const billings = await Billing.find({ operator: req.params.operatorId })
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation');

        // Calculate totals from Ledger
        let totalEarnings = 0;

        billings.forEach(billing => {
            totalEarnings += (billing.operatorAmount || 0);
        });

        // Get total paid amount from OperatorPayment
        const payments = await OperatorPayment.find({ operator: req.params.operatorId });
        let totalPaid = 0;
        payments.forEach(payment => {
            totalPaid += payment.amount;
        });

        const pendingAmount = totalEarnings - totalPaid;

        res.status(200).json({
            success: true,
            count: billings.length,
            totalEarnings,
            totalPaid,
            pendingAmount,
            data: billings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching billing entries for operator',
            error: error.message
        });
    }
});

// READ - Get billing entries by Studio ID with Date Range
// router.get('/studio/:studioId/date', async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;

//         // Build query filter
//         const filter = { studio: req.params.studioId };

//         // Add date range filter if provided
//         if (startDate || endDate) {
//             filter.date = {};
//             if (startDate) {
//                 filter.date.$gte = new Date(startDate);
//             }
//             if (endDate) {
//                 // Add one day to include the end date fully
//                 const end = new Date(endDate);
//                 end.setDate(end.getDate() + 1);
//                 filter.date.$lt = end;
//             }
//         }

//         const billings = await Billing.find(filter)
//             .populate('operator', 'name phoneNumber expertise')
//             .populate('studio', 'studioName studioLocation')
//             .sort({ date: -1 }); // Sort by date descending

//         // Calculate totals
//         let totalCredit = 0;
//         let totalDebit = 0;

//         billings.forEach(billing => {
//             if (billing.isCredit) {
//                 totalCredit += billing.amount;
//             } else {
//                 totalDebit += billing.amount;
//             }
//         });

//         const netAmount = totalCredit - totalDebit;

//         res.status(200).json({
//             success: true,
//             count: billings.length,
//             totalCredit,
//             totalDebit,
//             netAmount,
//             dateRange: {
//                 startDate: startDate || 'Not specified',
//                 endDate: endDate || 'Not specified'
//             },
//             data: billings
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching billing entries for studio by date',
//             error: error.message
//         });
//     }
// });

// READ - Get billing entries by Operator ID with Date Range
// router.get('/operator/:operatorId/date', async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;

//         // Build query filter
//         const filter = { operator: req.params.operatorId };

//         // Add date range filter if provided
//         if (startDate || endDate) {
//             filter.date = {};
//             if (startDate) {
//                 filter.date.$gte = new Date(startDate);
//             }
//             if (endDate) {
//                 // Add one day to include the end date fully
//                 const end = new Date(endDate);
//                 end.setDate(end.getDate() + 1);
//                 filter.date.$lt = end;
//             }
//         }

//         const billings = await Billing.find(filter)
//             .populate('operator', 'name phoneNumber expertise')
//             .populate('studio', 'studioName studioLocation')
//             .sort({ date: -1 }); // Sort by date descending

//         // Calculate totals
//         let totalCredit = 0;
//         let totalDebit = 0;

//         billings.forEach(billing => {
//             if (billing.isCredit) {
//                 totalCredit += billing.amount;
//             } else {
//                 totalDebit += billing.amount;
//             }
//         });

//         const netAmount = totalCredit - totalDebit;

//         res.status(200).json({
//             success: true,
//             count: billings.length,
//             totalCredit,
//             totalDebit,
//             netAmount,
//             dateRange: {
//                 startDate: startDate || 'Not specified',
//                 endDate: endDate || 'Not specified'
//             },
//             data: billings
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching billing entries for operator by date',
//             error: error.message
//         });
//     }
// });

// // READ - Get a single billing entry by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const billing = await Billing.findById(req.params.id)
//             .populate('operator', 'name phoneNumber expertise')
//             .populate('studio', 'studioName studioLocation');
//         if (!billing) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Billing entry not found'
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: billing
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching billing entry',
//             error: error.message
//         });
//     }
// });

// UPDATE - Update a billing entry by ID
router.post('/update/:id', async (req, res) => {
    try {
        const billing = await Billing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation');
        if (!billing) {
            return res.status(404).json({
                success: false,
                message: 'Billing entry not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Billing entry updated successfully',
            data: billing
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating billing entry',
            error: error.message
        });
    }
});

// DELETE - Delete a billing entry by ID
router.delete('/:id', async (req, res) => {
    try {
        const billing = await Billing.findByIdAndDelete(req.params.id);
        if (!billing) {
            return res.status(404).json({
                success: false,
                message: 'Billing entry not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Billing entry deleted successfully',
            data: billing
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting billing entry',
            error: error.message
        });
    }
});

// EXPORT - Export billing entries by Studio ID
router.post('/export/studio', async (req, res) => {
    try {
        const { studioId, startDate, endDate, paymentStatus } = req.body;

        if (!studioId) {
            return res.status(400).json({
                success: false,
                message: 'Studio ID is required'
            });
        }

        const query = { studio: studioId };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1);
                query.date.$lt = end;
            }
        }

        if (paymentStatus !== undefined) {
            query.paymentStatus = paymentStatus;
        }



        const billings = await Billing.find(query)
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation')
            .sort({ date: -1 });

        let totalAmount = 0;
        billings.forEach(bill => {
            totalAmount += bill.amount;
        });

        res.status(200).json({
            success: true,
            count: billings.length,
            totalAmount,
            data: billings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error exporting studio billings',
            error: error.message
        });
    }
});

// EXPORT - Export billing entries by Operator ID
router.post('/export/operator', async (req, res) => {
    try {
        const { operatorId, startDate, endDate, paymentStatus } = req.body;

        if (!operatorId) {
            return res.status(400).json({
                success: false,
                message: 'Operator ID is required'
            });
        }

        const query = { operator: operatorId };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1);
                query.date.$lt = end;
            }
        }

        if (paymentStatus !== undefined) {
            query.paymentStatus = paymentStatus;
        }



        const billings = await Billing.find(query)
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation')
            .sort({ date: -1 });

        let totalAmount = 0;
        billings.forEach(bill => {
            totalAmount += bill.amount;
        });

        res.status(200).json({
            success: true,
            count: billings.length,
            totalAmount,
            data: billings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error exporting operator billings',
            error: error.message
        });
    }
});

module.exports = router;
