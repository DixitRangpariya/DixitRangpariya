const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');

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

// READ - Get billing entries by Studio ID
router.get('/studio/:studioId', async (req, res) => {
    try {
        const billings = await Billing.find({ studio: req.params.studioId })
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation');

        // Calculate total amount for this studio
        const totalAmount = billings.reduce((sum, billing) => sum + billing.amount, 0);

        res.status(200).json({
            success: true,
            count: billings.length,
            totalAmount: totalAmount,
            data: billings
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

        // Calculate total amount for this operator
        const totalAmount = billings.reduce((sum, billing) => sum + billing.amount, 0);

        res.status(200).json({
            success: true,
            count: billings.length,
            totalAmount: totalAmount,
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
router.get('/studio/:studioId/date', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build query filter
        const filter = { studio: req.params.studioId };

        // Add date range filter if provided
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                // Add one day to include the end date fully
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1);
                filter.date.$lt = end;
            }
        }

        const billings = await Billing.find(filter)
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation')
            .sort({ date: -1 }); // Sort by date descending

        // Calculate total amount
        const totalAmount = billings.reduce((sum, billing) => sum + billing.amount, 0);

        res.status(200).json({
            success: true,
            count: billings.length,
            totalAmount: totalAmount,
            dateRange: {
                startDate: startDate || 'Not specified',
                endDate: endDate || 'Not specified'
            },
            data: billings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching billing entries for studio by date',
            error: error.message
        });
    }
});

// READ - Get billing entries by Operator ID with Date Range
router.get('/operator/:operatorId/date', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build query filter
        const filter = { operator: req.params.operatorId };

        // Add date range filter if provided
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                // Add one day to include the end date fully
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1);
                filter.date.$lt = end;
            }
        }

        const billings = await Billing.find(filter)
            .populate('operator', 'name phoneNumber expertise')
            .populate('studio', 'studioName studioLocation')
            .sort({ date: -1 }); // Sort by date descending

        // Calculate total amount
        const totalAmount = billings.reduce((sum, billing) => sum + billing.amount, 0);

        res.status(200).json({
            success: true,
            count: billings.length,
            totalAmount: totalAmount,
            dateRange: {
                startDate: startDate || 'Not specified',
                endDate: endDate || 'Not specified'
            },
            data: billings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching billing entries for operator by date',
            error: error.message
        });
    }
});

// READ - Get a single billing entry by ID
router.get('/:id', async (req, res) => {
    try {
        const billing = await Billing.findById(req.params.id)
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
            data: billing
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching billing entry',
            error: error.message
        });
    }
});

// UPDATE - Update a billing entry by ID
router.put('/:id', async (req, res) => {
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

module.exports = router;
