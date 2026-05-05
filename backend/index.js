const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('todos.db');

app.use(cors());
app.use(express.json());

 db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { title, priority } = req.body;
  const result = db.prepare('INSERT INTO todos (title, priority) VALUES (?, ?)').run(title, priority || 'medium');
  res.json({ id: result.lastInsertRowid, title, priority: priority || 'medium', completed: 0 });
});

app.put('/todos/:id', (req, res) => {
  const { completed } = req.body;
  db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed, req.params.id);
  res.json({ success: true });
});

app.delete('/todos/:id', (req, res) => {
  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => {
  console.log('Server chal raha hai port 5000 pe!');
});