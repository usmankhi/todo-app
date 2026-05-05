const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('todos.db');

app.use(cors());
app.use(express.json());

// Database table banao
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// GET — sab todos lao
app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos);
});

// POST — naya todo add karo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  const result = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title);
  res.json({ id: result.lastInsertRowid, title, completed: 0 });
});

// PUT — todo complete/incomplete karo
app.put('/todos/:id', (req, res) => {
  const { completed } = req.body;
  db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed, req.params.id);
  res.json({ success: true });
});

// DELETE — todo delete karo
app.delete('/todos/:id', (req, res) => {
  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => {
  console.log('Server chal raha hai port 5000 pe!');
});