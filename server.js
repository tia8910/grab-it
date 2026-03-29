const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define the directory for file storage
const fileDir = path.join(__dirname, 'files');

// Make sure the directory exists
if (!fs.existsSync(fileDir)){ fs.mkdirSync(fileDir); }

// CREATE: Upload a file
app.post('/files', (req, res) => {
    const { filename, content } = req.body;
    const filePath = path.join(fileDir, filename);
    fs.writeFile(filePath, content, (err) => {
        if (err) return res.status(500).json({ message: 'File upload failed', error: err });
        res.status(201).json({ message: 'File created successfully', filename });
    });
});

// READ: Get a file
app.get('/files/:filename', (req, res) => {
    const filePath = path.join(fileDir, req.params.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(404).json({ message: 'File not found', error: err });
        res.status(200).json({ filename: req.params.filename, content: data });
    });
});

// UPDATE: Update a file
app.put('/files/:filename', (req, res) => {
    const filePath = path.join(fileDir, req.params.filename);
    const { content } = req.body;
    fs.writeFile(filePath, content, (err) => {
        if (err) return res.status(500).json({ message: 'File update failed', error: err });
        res.status(200).json({ message: 'File updated successfully', filename: req.params.filename });
    });
});

// DELETE: Delete a file
app.delete('/files/:filename', (req, res) => {
    const filePath = path.join(fileDir, req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(404).json({ message: 'File not found', error: err });
        res.status(200).json({ message: 'File deleted successfully', filename: req.params.filename });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});