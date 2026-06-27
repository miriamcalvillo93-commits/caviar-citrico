const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// (Opcional) Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor OK");
});

// ===== GET: listar contactos =====
app.get("/api/contactos", (req, res) => {
  db.all(
    "SELECT id, name, email, message, created_at FROM contactos ORDER BY id DESC",
    (err, rows) => {
      if (err) {
        console.error("ERROR SELECT:", err.message);
        return res.status(500).json({ ok: false, msg: "Error leyendo BD" });
      }
      res.json(rows);
    }
  );
});

// ===== POST: guardar contacto =====
app.post("/api/contactos", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, msg: "Faltan campos" });
  }

  const sql = `
    INSERT INTO contactos (name, email, message, created_at)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name.trim(), email.trim(), message.trim(), new Date().toISOString()],
    function (err) {
      if (err) {
        console.error("ERROR INSERT:", err.message);
        return res.status(500).json({ ok: false, msg: "Error guardando en BD" });
      }
      return res.status(201).json({ ok: true, id: this.lastID });
    }
  );
});

// Server up
app.listen(PORT, () => {
  console.log(`Servidor OK -> http://localhost:${PORT}`);
});
