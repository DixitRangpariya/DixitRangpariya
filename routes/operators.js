const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');

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
router.put('/:id', async (req, res) => {
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
