require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const operatorRoutes = require('./routes/operators');
const studioRoutes = require('./routes/studios');
const billingRoutes = require('./routes/billings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/operators', operatorRoutes);
app.use('/api/studios', studioRoutes);
app.use('/api/billings', billingRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Photo Studio Billing System API',
        endpoints: {
            operators: {
                'GET /api/operators': 'Get all operators',
                'GET /api/operators/:id': 'Get a single operator',
                'POST /api/operators': 'Create a new operator',
                'POST /api/operators/update/:id': 'Update an operator',
                'DELETE /api/operators/:id': 'Delete an operator'
            },
            studios: {
                'GET /api/studios': 'Get all studios',
                'GET /api/studios/:id': 'Get a single studio',
                'POST /api/studios': 'Create a new studio',
                'POST /api/studios/update/:id': 'Update a studio',
                'DELETE /api/studios/:id': 'Delete a studio'
            },
            billings: {
                'GET /api/billings': 'Get all billing entries',
                'GET /api/billings/:id': 'Get a single billing entry',
                'POST /api/billings': 'Create a new billing entry',
                'POST /api/billings/update/:id': 'Update a billing entry',
                'DELETE /api/billings/:id': 'Delete a billing entry'
            }
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
