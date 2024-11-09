const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let data = []; // Placeholder for user data storage

// Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.status(200).sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.status(200).sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Create a new user (Registration)
app.post('/register', (req, res) => {
    let { username, password, password2 } = req.body;
    let errors = [];

    if (password !== password2) {
        errors.push('Passwords do not match');
    }
    if (password.length < 5) {
        errors.push('Password must be longer than 5 characters');
    }

    if (errors.length === 0) {
        let user = { id: Date.now(), username, password }; // Simple user object with unique ID
        data.push(user);
        res.status(201).json({ success: true, data: user });
    } else {
        res.status(400).json({ success: false, errors });
    }
});

// Read all users
app.get('/users', (req, res) => {
    res.status(200).json({ success: true, data });
});

// Update user by ID
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { username, password } = req.body;
    let user = data.find(user => user.id === userId);

    if (user) {
        if (username) user.username = username;
        if (password) user.password = password;
        res.status(200).json({ success: true, data: user });
    } else {
        res.status(404).json({ success: false, error: 'User not found' });
    }
});

// Delete user by ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = data.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        data.splice(userIndex, 1);
        res.status(200).json({ success: true, message: 'User deleted' });
    } else {
        res.status(404).json({ success: false, error: 'User not found' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
