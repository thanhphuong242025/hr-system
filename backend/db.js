const isPg = !!process.env.DATABASE_URL;

class DBWrapper {
    constructor() {
        if (isPg) {
            console.log("Using PostgreSQL Database");
            const { Pool } = require('pg');
            this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
            this.initPg();
        } else {
            console.log("Using SQLite Database");
            const sqlite3 = require('sqlite3').verbose();
            const path = require('path');
            const dataDir = process.env.DATA_DIR || __dirname;
            this.sqliteDb = new sqlite3.Database(path.join(dataDir, 'database.sqlite'));
            this.initSqlite();
        }
    }

    initPg() {
        this.pool.query(`
            CREATE TABLE IF NOT EXISTS evaluations (
                id SERIAL PRIMARY KEY,
                employee_name TEXT NOT NULL,
                employee_role TEXT NOT NULL,
                position_type TEXT DEFAULT 'DR',
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                scores TEXT DEFAULT '{}',
                leader_scores TEXT DEFAULT '{}',
                leader_notes TEXT DEFAULT '',
                leader_reviewed_by TEXT DEFAULT '',
                leader_reviewed_at TIMESTAMP,
                ceo_scores TEXT DEFAULT '{}',
                council_scores TEXT DEFAULT '{}',
                council_notes TEXT DEFAULT '',
                council_reviewed_by TEXT DEFAULT '',
                council_reviewed_at TIMESTAMP,
                strengths TEXT DEFAULT '',
                weaknesses TEXT DEFAULT '',
                skills_needed TEXT DEFAULT '',
                self_comment TEXT DEFAULT '',
                final_grade TEXT DEFAULT '',
                status TEXT DEFAULT 'SUBMITTED'
            );
        `).catch(console.error);
    }

    initSqlite() {
        this.sqliteDb.serialize(() => {
            this.sqliteDb.run(`CREATE TABLE IF NOT EXISTS evaluations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_name TEXT NOT NULL,
                employee_role TEXT NOT NULL,
                position_type TEXT DEFAULT 'DR',
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                scores TEXT DEFAULT '{}',
                leader_scores TEXT DEFAULT '{}',
                leader_notes TEXT DEFAULT '',
                leader_reviewed_by TEXT DEFAULT '',
                leader_reviewed_at DATETIME,
                ceo_scores TEXT DEFAULT '{}',
                council_scores TEXT DEFAULT '{}',
                council_notes TEXT DEFAULT '',
                council_reviewed_by TEXT DEFAULT '',
                council_reviewed_at DATETIME,
                strengths TEXT DEFAULT '',
                weaknesses TEXT DEFAULT '',
                skills_needed TEXT DEFAULT '',
                self_comment TEXT DEFAULT '',
                final_grade TEXT DEFAULT '',
                status TEXT DEFAULT 'SUBMITTED'
            )`, (err) => {
                if (err) { console.error('Table create error:', err); return; }
                // Add new columns if upgrading from old schema
                const newCols = [
                    "ALTER TABLE evaluations ADD COLUMN position_type TEXT DEFAULT 'DR'",
                    "ALTER TABLE evaluations ADD COLUMN leader_scores TEXT DEFAULT '{}'",
                    "ALTER TABLE evaluations ADD COLUMN leader_notes TEXT DEFAULT ''",
                    "ALTER TABLE evaluations ADD COLUMN leader_reviewed_by TEXT DEFAULT ''",
                    "ALTER TABLE evaluations ADD COLUMN leader_reviewed_at DATETIME",
                    "ALTER TABLE evaluations ADD COLUMN council_scores TEXT DEFAULT '{}'",
                    "ALTER TABLE evaluations ADD COLUMN council_notes TEXT DEFAULT ''",
                    "ALTER TABLE evaluations ADD COLUMN council_reviewed_by TEXT DEFAULT ''",
                    "ALTER TABLE evaluations ADD COLUMN council_reviewed_at DATETIME",
                    "ALTER TABLE evaluations ADD COLUMN strengths TEXT DEFAULT ''",
                    "ALTER TABLE evaluations ADD COLUMN weaknesses TEXT DEFAULT ''",
                    "ALTER TABLE evaluations ADD COLUMN skills_needed TEXT DEFAULT ''",
                    "ALTER TABLE evaluations ADD COLUMN self_comment TEXT DEFAULT ''",
                    "ALTER TABLE evaluations ADD COLUMN final_grade TEXT DEFAULT ''",
                ];
                newCols.forEach(sql => {
                    this.sqliteDb.run(sql, () => {}); // ignore "duplicate column" errors
                });
            });
        });
    }

    async runInsert(query, params) {
        if (isPg) {
            let i = 1;
            const pgQuery = query.replace(/\?/g, () => `$${i++}`);
            const result = await this.pool.query(pgQuery + ' RETURNING id', params);
            return result.rows[0].id;
        } else {
            return new Promise((resolve, reject) => {
                this.sqliteDb.run(query, params, function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
            });
        }
    }

    async runUpdate(query, params) {
        if (isPg) {
            let i = 1;
            const pgQuery = query.replace(/\?/g, () => `$${i++}`);
            const result = await this.pool.query(pgQuery, params);
            return result.rowCount;
        } else {
            return new Promise((resolve, reject) => {
                this.sqliteDb.run(query, params, function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                });
            });
        }
    }

    async all(query, params = []) {
        if (isPg) {
            let i = 1;
            const pgQuery = query.replace(/\?/g, () => `$${i++}`);
            const result = await this.pool.query(pgQuery, params);
            return result.rows;
        } else {
            return new Promise((resolve, reject) => {
                this.sqliteDb.all(query, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    }

    async get(query, params = []) {
        if (isPg) {
            let i = 1;
            const pgQuery = query.replace(/\?/g, () => `$${i++}`);
            const result = await this.pool.query(pgQuery, params);
            return result.rows[0] || null;
        } else {
            return new Promise((resolve, reject) => {
                this.sqliteDb.get(query, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row || null);
                });
            });
        }
    }
}

module.exports = new DBWrapper();
