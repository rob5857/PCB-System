const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(
      "CREATE TABLE IF NOT EXISTS messages (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "content TEXT NOT NULL" +
      ")"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS assignments (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "content TEXT NOT NULL" +
      ")"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS events (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "title TEXT NOT NULL," +
      "date TEXT NOT NULL," +
      "description TEXT" +
      ")"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS reports (" +
      "id INTEGER PRIMARY KEY AUTOINCREMENT," +
      "content TEXT NOT NULL," +
      "submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP" +
      ")"
    );
  }
});

// API endpoint to get all messages
app.get('/api/messages', (req, res) => {
  db.all('SELECT * FROM messages', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to add a new message
app.post('/api/messages', (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  db.run('INSERT INTO messages (content) VALUES (?)', [content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, content });
  });
});

// API endpoint to get all assignments
app.get('/api/assignments', (req, res) => {
  db.all('SELECT * FROM assignments', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to add a new assignment
app.post('/api/assignments', (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  db.run('INSERT INTO assignments (content) VALUES (?)', [content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, content });
  });
});

// API endpoint to get all events
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY date', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to add a new event
app.post('/api/events', (req, res) => {
  const { title, date, description } = req.body;
  if (!title || !date) {
    res.status(400).json({ error: 'Title and date are required' });
    return;
  }
  db.run('INSERT INTO events (title, date, description) VALUES (?, ?, ?)', [title, date, description || ''], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, date, description: description || '' });
  });
});

// API endpoint to delete an event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  });
});

// API endpoint to get all reports
app.get('/api/reports', (req, res) => {
  db.all('SELECT * FROM reports ORDER BY submitted_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to add a new report
app.post('/api/reports', (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  db.run('INSERT INTO reports (content) VALUES (?)', [content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, content, submitted_at: new Date().toISOString() });
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
});
