const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dataDir = process.env.DATA_DIR || __dirname;
const db = new sqlite3.Database(path.join(dataDir, 'database.sqlite'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT,
        department TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT,
        employee_role TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        scores TEXT, -- JSON string of answers
        ceo_scores TEXT, -- JSON string of ceo answers
        council_scores TEXT, -- JSON string of council answers
        notes TEXT, -- CEO/Council notes
        status TEXT DEFAULT 'SUBMITTED' -- SUBMITTED, CEO_REVIEWED, COUNCIL_REVIEWED
    )`);
});

module.exports = db;
