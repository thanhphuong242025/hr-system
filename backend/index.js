const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API Login (Simple hardcoded for now, should use DB in production)
const MANAGER_ACCOUNTS = [
    { username: 'ceo', password: 'ceo@2025', role: 'council', fullName: 'Ban Giám Đốc / Hội Đồng', department: 'Ban Giám Đốc' },
    { username: 'leader1', password: 'leader@2025', role: 'leader', fullName: 'Lãnh Đạo Khoa', department: 'Khoa Lâm Sàng' },
    { username: 'leader2', password: 'leader@2025', role: 'leader', fullName: 'Lãnh Đạo Phòng', department: 'Phòng Ban Hành Chính' }
];

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = MANAGER_ACCOUNTS.find(u => u.username === username && u.password === password);
    if (user) {
        // In real app, return JWT. Here we return user details.
        const { password, ...userInfo } = user;
        res.json({ success: true, user: userInfo });
    } else {
        res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
});

// Submit a new evaluation (Employee)
app.post('/api/evaluations', async (req, res) => {
    const { employee_name, employee_role, position_type, scores, self_comment } = req.body;
    try {
        const id = await db.runInsert(
            `INSERT INTO evaluations (
                employee_name, employee_role, position_type, scores, self_comment, status
            ) VALUES (?, ?, ?, ?, ?, 'SUBMITTED')`,
            [employee_name, employee_role, position_type, JSON.stringify(scores || {}), self_comment || '']
        );
        res.json({ success: true, id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all evaluations (For Leaders and Council)
app.get('/api/evaluations', async (req, res) => {
    try {
        const rows = await db.all("SELECT * FROM evaluations ORDER BY id DESC");
        res.json(rows.map(r => ({
            ...r,
            scores: JSON.parse(r.scores || "{}"),
            leader_scores: JSON.parse(r.leader_scores || "{}"),
            ceo_scores: JSON.parse(r.ceo_scores || "{}"), // legacy
            council_scores: JSON.parse(r.council_scores || "{}")
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an evaluation (Leader or Council review)
app.put('/api/evaluations/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    let queryArgs = [];
    let querySets = [];

    const allowedFields = [
        'leader_scores', 'leader_notes', 'leader_reviewed_by', 'leader_reviewed_at',
        'council_scores', 'council_notes', 'council_reviewed_by', 'council_reviewed_at',
        'strengths', 'weaknesses', 'skills_needed', 'final_grade', 'status'
    ];

    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            querySets.push(`${field} = ?`);
            let val = updates[field];
            if (field.endsWith('_scores')) val = JSON.stringify(val);
            queryArgs.push(val);
        }
    });

    if (querySets.length === 0) return res.json({ success: true, changes: 0 });

    const query = `UPDATE evaluations SET ${querySets.join(", ")} WHERE id = ?`;
    queryArgs.push(id);

    try {
        const changes = await db.runUpdate(query, queryArgs);
        res.json({ success: true, changes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all: serve React app for any non-API route
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
