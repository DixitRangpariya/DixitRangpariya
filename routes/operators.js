const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');
const Billing = require('../models/Billing');

// CREATE - Add a new operator
router.post('/', async (req, res) => {
    try {
        const operator = new Operator(req.body);
        await operator.save();
        res.status(201).json({
            success: true,
            message: 'Operator created successfully',
            data: operator
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating operator',
            error: error.message
        });
    }
});

// READ - Get all operators
router.get('/', async (req, res) => {
    try {
        const operators = await Operator.find();
        res.status(200).json({
            success: true,
            count: operators.length,
            data: operators
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching operators',
            error: error.message
        });
    }
});

// SEARCH - Search operators by name
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a name to search for'
            });
        }

        const operators = await Operator.find({
            name: { $regex: name, $options: 'i' }
        });

        res.status(200).json({
            success: true,
            count: operators.length,
            data: operators
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching operators',
            error: error.message
        });
    }
});

// READ - Get a single operator by ID
router.get('/:id', async (req, res) => {
    try {
        const operator = await Operator.findById(req.params.id);
        if (!operator) {
            return res.status(404).json({
                success: false,
                message: 'Operator not found'
            });
        }
        res.status(200).json({
            success: true,
            data: operator
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching operator',
            error: error.message
        });
    }
});

// UPDATE - Update an operator by ID
router.post('/update/:id', async (req, res) => {
    try {
        const operator = await Operator.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!operator) {
            return res.status(404).json({
                success: false,
                message: 'Operator not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Operator updated successfully',
            data: operator
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating operator',
            error: error.message
        });
    }
});

// DELETE - Delete an operator by ID
router.delete('/:id', async (req, res) => {
    try {
        // Check if operator has any associated bills
        const billCount = await Billing.countDocuments({ operator: req.params.id });
        if (billCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete operator. It is associated with existing bills.'
            });
        }

        const operator = await Operator.findByIdAndDelete(req.params.id);
        if (!operator) {
            return res.status(404).json({
                success: false,
                message: 'Operator not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Operator deleted successfully',
            data: operator
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting operator',
            error: error.message
        });
    }
});

module.exports = router;
