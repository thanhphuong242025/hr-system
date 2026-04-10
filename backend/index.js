const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Submit a new evaluation
app.post('/api/evaluations', (req, res) => {
    const { employee_name, employee_role, scores } = req.body;
    const stmt = db.prepare("INSERT INTO evaluations (employee_name, employee_role, scores) VALUES (?, ?, ?)");
    stmt.run(employee_name, employee_role, JSON.stringify(scores), function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

// Get all evaluations
app.get('/api/evaluations', (req, res) => {
    db.all("SELECT * FROM evaluations ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => ({
            ...r,
            scores: JSON.parse(r.scores || "{}"),
            ceo_scores: JSON.parse(r.ceo_scores || "{}"),
            council_scores: JSON.parse(r.council_scores || "{}")
        })));
    });
});

// Update an evaluation
app.put('/api/evaluations/:id', (req, res) => {
    const { id } = req.params;
    const { ceo_scores, council_scores, notes, status } = req.body;
    let query = "UPDATE evaluations SET ";
    let updates = [];
    let params = [];
    if (ceo_scores !== undefined) {
        updates.push("ceo_scores = ?");
        params.push(JSON.stringify(ceo_scores));
    }
    if (council_scores !== undefined) {
        updates.push("council_scores = ?");
        params.push(JSON.stringify(council_scores));
    }
    if (notes !== undefined) {
        updates.push("notes = ?");
        params.push(notes);
    }
    if (status !== undefined) {
        updates.push("status = ?");
        params.push(status);
    }
    if (updates.length === 0) return res.json({ success: true, changes: 0 });
    
    query += updates.join(", ") + " WHERE id = ?";
    params.push(id);

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, changes: this.changes });
    });
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all: serve React app for any non-API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
