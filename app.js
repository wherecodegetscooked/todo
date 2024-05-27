// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get all tasks
app.get('/api/tasks', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Route to add a new task
app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const tasks = JSON.parse(data);
        tasks.push(newTask);
        fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json({ message: 'Task added successfully' });
        });
    });
});

// Serve the index.html file for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
