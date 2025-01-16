const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware for error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// GET / - Welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the Prismatic Employees API.');
});

// GET /employees - Get all employees
app.get('/employees', async (req, res, next) => {
    try {
        const employees = await prisma.employee.findMany();
        res.json(employees);
    } catch (err) {
        next(err);
    }
});

// POST /employees - Add a new employee
app.post('/employees', async (req, res, next) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid name provided.' });
    }

    try {
        const newEmployee = await prisma.employee.create({
            data: { name },
        });
        res.status(201).json(newEmployee);
    } catch (err) {
        next(err);
    }
});

// GET /employees/:id - Get employee by ID
app.get('/employees/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        res.json(employee);
    } catch (err) {
        next(err);
    }
});

// PUT /employees/:id - Update employee by ID
app.put('/employees/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid name provided.' });
    }

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: { name },
        });

        res.status(200).json(updatedEmployee);
    } catch (err) {
        next(err);
    }
});

// DELETE /employees/:id - Delete employee by ID
app.delete('/employees/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) },
        });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        await prisma.employee.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
