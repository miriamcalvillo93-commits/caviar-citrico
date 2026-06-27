const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "caviarcitrico.db");

const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error("Error DB:", err.message);
  } else {
    console.log("DB conectada");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS contactos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
});

module.exports = db;
