const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM groupsplit');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

// Add a new user
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const { rows } = await db.query('INSERT INTO groupsplit (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

module.exports = router;
