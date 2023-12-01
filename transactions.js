// transactions.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// POST - AddTransaction
router.post('/AddTransaction', async (req, res) => {
  try {
    const { groupName, paidBy, paidFor, amount } = req.body;

    // Validate that groupName, paidBy, and paidFor are provided
    if (!groupName || !paidBy || !paidFor || amount === undefined) {
      return res.status(400).json({ error: 'Invalid input. Please provide groupName, paidBy, paidFor, and amount.' });
    }

    // Validate that the amount is a number
    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid input. Amount must be a number.' });
    }

    // Validate that the group table exists
    const checkTableQuery = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${groupName}')`;
    const tableExistsResult = await db.queryGroups(checkTableQuery);
    const tableExists = tableExistsResult.rows[0].exists;

    if (!tableExists) {
      return res.status(400).json({ error: `Table '${groupName}' does not exist.` });
    }

    // Validate that the 'paidBy' user exists in the group table
    const checkPaidByUserQuery = `SELECT EXISTS (SELECT 1 FROM ${groupName} WHERE "UserUUID" = '${paidBy}')`;
    const paidByUserExistsResult = await db.queryGroups(checkPaidByUserQuery);
    const paidByUserExists = paidByUserExistsResult.rows[0].exists;

    if (!paidByUserExists) {
      return res.status(400).json({ error: `User '${paidBy}' does not exist in table '${groupName}'` });
    }

    // Validate that the 'paidFor' user exists in the group table
    const checkPaidForUserQuery = `SELECT EXISTS (SELECT 1 FROM ${groupName} WHERE "UserUUID" = '${paidFor}')`;
    const paidForUserExistsResult = await db.queryGroups(checkPaidForUserQuery);
    const paidForUserExists = paidForUserExistsResult.rows[0].exists;

    if (!paidForUserExists) {
      return res.status(400).json({ error: `User '${paidFor}' does not exist in table '${groupName}'` });
    }

    // Update the amount for the specified 'paidBy' and 'paidFor' users
    const updateAmountQuery = `
      UPDATE ${groupName}
      SET "${paidBy}" = "${paidBy}" + ${amount}
      WHERE "UserUUID" = '${paidFor}'
    `;
    await db.queryGroups(updateAmountQuery);

    res.status(200).json({ success: true, message: 'Amount added successfully.', groupName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while adding the amount to the group table.' });
  }
});

// POST - Settle between two
router.post('/Settle', async (req, res) => {
    try {
      const { paidBy, paidFor, groupName } = req.body;
  
      // Validate that groupName, paidBy, and paidFor are provided
      if (!paidBy || !paidFor) {
        return res.status(400).json({ error: 'Invalid input. Please provide groupName, paidBy, paidFor, and amount.' });
      }
  
      // Validate that the group table exists
      const checkTableQuery = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${groupName}')`;
      const tableExistsResult = await db.queryGroups(checkTableQuery);
      const tableExists = tableExistsResult.rows[0].exists;
  
      if (!tableExists) {
        return res.status(400).json({ error: `Table '${groupName}' does not exist.` });
      }
  
      // Validate that the 'paidBy' user exists in the group table
      const checkPaidByUserQuery = `SELECT EXISTS (SELECT 1 FROM ${groupName} WHERE "UserUUID" = '${paidBy}')`;
      const paidByUserExistsResult = await db.queryGroups(checkPaidByUserQuery);
      const paidByUserExists = paidByUserExistsResult.rows[0].exists;
  
      if (!paidByUserExists) {
        return res.status(400).json({ error: `User '${paidBy}' does not exist in table '${groupName}'` });
      }
  
      // Validate that the 'paidFor' user exists in the group table
      const checkPaidForUserQuery = `SELECT EXISTS (SELECT 1 FROM ${groupName} WHERE "UserUUID" = '${paidFor}')`;
      const paidForUserExistsResult = await db.queryGroups(checkPaidForUserQuery);
      const paidForUserExists = paidForUserExistsResult.rows[0].exists;
  
      if (!paidForUserExists) {
        return res.status(400).json({ error: `User '${paidFor}' does not exist in table '${groupName}'` });
      }
  
      // Update the amount for the specified 'paidBy' and 'paidFor' users
      var updateAmountQuery = `
        UPDATE ${groupName}
        SET "${paidBy}" = 0
        WHERE "UserUUID" = '${paidFor}'
      `;
      await db.queryGroups(updateAmountQuery);
      updateAmountQuery = `
      UPDATE ${groupName}
      SET "${paidFor}" = 0
      WHERE "UserUUID" = '${paidBy}'
    `;
     await db.queryGroups(updateAmountQuery);
      res.status(200).json({ success: true, message: 'Amount added successfully.', groupName });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while adding the amount to the group table.' });
    }
  });

  // POST - SettleGroup
router.post('/SettleGroup/:groupName', async (req, res) => {
    try {
      const { groupName } = req.params;
  
      // Validate that groupName is provided
      if (!groupName) {
        return res.status(400).json({ error: 'Invalid input. Please provide groupName.' });
      }
  
      // Validate that the group table exists
      const checkTableQuery = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${groupName}')`;
      const tableExistsResult = await db.queryGroups(checkTableQuery);
      const tableExists = tableExistsResult.rows[0].exists;
  
      if (!tableExists) {
        return res.status(400).json({ error: `Table '${groupName}' does not exist.` });
      }
  
      // Get the column names (excluding UserUUID)
      const getColumnNamesQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = '${groupName}' AND column_name != 'UserUUID'
      `;
      const columnNamesResult = await db.queryGroups(getColumnNamesQuery);
      const columnNames = columnNamesResult.rows.map(row => row.column_name);
  
      // Update all columns except UserUUID to 0
      const resetColumnsQuery = `
        UPDATE ${groupName}
        SET ${columnNames.map(column => `"${column}" = 0`).join(', ')}
      `;
      await db.queryGroups(resetColumnsQuery);
  
      res.status(200).json({ success: true, message: 'Columns reset successfully.', groupName });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while resetting columns in the group table.' });
    }
  });

module.exports = router;
