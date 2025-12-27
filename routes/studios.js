const express = require('express');
const router = express.Router();
const Studio = require('../models/Studio');

// CREATE - Add a new studio
router.post('/', async (req, res) => {
    try {
        const studio = new Studio(req.body);
        await studio.save();
        res.status(201).json({
            success: true,
            message: 'Studio created successfully',
            data: studio
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating studio',
            error: error.message
        });
    }
});

// READ - Get all studios
router.get('/', async (req, res) => {
    try {
        const studios = await Studio.find();
        res.status(200).json({
            success: true,
            count: studios.length,
            data: studios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching studios',
            error: error.message
        });
    }
});

// SEARCH - Search studios by name
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a name to search for'
            });
        }

        const studios = await Studio.find({
            studioName: { $regex: name, $options: 'i' }
        });

        res.status(200).json({
            success: true,
            count: studios.length,
            data: studios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching studios',
            error: error.message
        });
    }
});

// READ - Get a single studio by ID
router.get('/:id', async (req, res) => {
    try {
        const studio = await Studio.findById(req.params.id);
        if (!studio) {
            return res.status(404).json({
                success: false,
                message: 'Studio not found'
            });
        }
        res.status(200).json({
            success: true,
            data: studio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching studio',
            error: error.message
        });
    }
});

// UPDATE - Update a studio by ID
router.put('/:id', async (req, res) => {
    try {
        const studio = await Studio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!studio) {
            return res.status(404).json({
                success: false,
                message: 'Studio not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Studio updated successfully',
            data: studio
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating studio',
            error: error.message
        });
    }
});

// DELETE - Delete a studio by ID
router.delete('/:id', async (req, res) => {
    try {
        const studio = await Studio.findByIdAndDelete(req.params.id);
        if (!studio) {
            return res.status(404).json({
                success: false,
                message: 'Studio not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Studio deleted successfully',
            data: studio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting studio',
            error: error.message
        });
    }
});

module.exports = router;
