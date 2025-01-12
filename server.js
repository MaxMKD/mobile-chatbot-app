const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(express.static('public'));

// OpenAI API setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SQLite setup
const db = new sqlite3.Database('./database.sqlite');
db.run(`CREATE TABLE IF NOT EXISTS chat_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt TEXT,
  response TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Serve login page as default
app.get('/', (req, res) => {
  if (req.session.authenticated) {
    return res.redirect('/index.html');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD) {
    req.session.authenticated = true;
    return res.redirect('/index.html');
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Logout endpoint
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.redirect('/');
  });
});

// Protect routes with authentication middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/login.html');
};

// API routes
app.use('/chat', ensureAuthenticated);
app.use('/history', ensureAuthenticated);

// Chat endpoint (user sends prompt to get AI response)
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = response.choices[0].message.content;

    db.run(`INSERT INTO chat_history (prompt, response) VALUES (?, ?)`, [prompt, reply], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error saving to database' });
      }
      res.json({ reply, id: this.lastID });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error communicating with OpenAI API' });
  }
});

// Get chat history
app.get('/history', (req, res) => {
  db.all(`SELECT * FROM chat_history ORDER BY timestamp`, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching chat history' });
    } else {
      res.json(rows);
    }
  });
});

// Delete specific chat history
app.delete('/history/:id', (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM chat_history WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting history entry.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Entry not found.' });
    }

    res.json({ success: 'Entry deleted successfully.' });
  });
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});