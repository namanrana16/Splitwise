const express = require('express');
const router = express.Router();
const db = require('./db');
const crypto = require('crypto');

// ...

// GET - UserByEmailPass
router.get('/UserByEmailPass', async (req, res) => {
  try {
    const { email, password } = req.query;
    const hashedInput = crypto.createHash('sha256').update(`${email}-${password}`).digest('hex');
    const { rows } = await db.query('SELECT user_uuid FROM users WHERE password_hash = $1', [hashedInput]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
});

// POST - Create User
router.post('/CreateUser', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedInput = crypto.createHash('sha256').update(`${email}-${password}`).digest('hex');
    const user_uuid = crypto.randomUUID();
    const { rows } = await db.query(
      'INSERT INTO users (user_uuid, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_uuid, name, email, hashedInput]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
});

// PUT - Update name/password
router.put('/UpdateUser', async (req, res) => {
  try {
    const { user_uuid, name, password } = req.body;
    const hashedInput = crypto.createHash('sha256').update(`${email}-${password}`).digest('hex');
    const { rows } = await db.query(
      'UPDATE users SET name = $1, password_hash = $2 WHERE user_uuid = $3 RETURNING *',
      [name, hashedInput, user_uuid]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
});

module.exports = router;
