const isPg = !!process.env.DATABASE_URL;

class DBWrapper {
    constructor() {
        if (isPg) {
            console.log("Using PostgreSQL Database");
            const { Pool } = require('pg');
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL
            });
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
                employee_name TEXT,
                employee_role TEXT,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                scores TEXT,
                ceo_scores TEXT,
                council_scores TEXT,
                notes TEXT,
                status TEXT DEFAULT 'SUBMITTED'
            );
        `).catch(console.error);
    }

    initSqlite() {
        this.sqliteDb.serialize(() => {
            this.sqliteDb.run(`CREATE TABLE IF NOT EXISTS evaluations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_name TEXT,
                employee_role TEXT,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                scores TEXT,
                ceo_scores TEXT,
                council_scores TEXT,
                notes TEXT,
                status TEXT DEFAULT 'SUBMITTED'
            )`);
        });
    }

    async runInsert(query, params) {
        if (isPg) {
            let i = 1;
            const pgQuery = query.replace(/\?/g, () => `$${i++}`);
            const result = await this.pool.query(pgQuery + ' RETURNING id', params);
            return result.rows[0].id; // Return the new ID
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
            return result.rowCount; // Return number of changes
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
}

module.exports = new DBWrapper();
