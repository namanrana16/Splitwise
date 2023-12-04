const express = require('express');
const { UUID } = require('mongodb');
const mongoose = require('mongoose');
const router = express.Router();
const { ObjectId } = require('mongodb');
const crypto = require('crypto');

mongoose.connect('mongodb://localhost:27017/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    // Define other fields as needed
});


const User = mongoose.model('User', userSchema);


router.get('/getData', async (req, res) => {
    try {
        
                
        const userData = await User.find({});
     
        res.json(userData);
    } catch (error) {
        res.status(500).send(error.message); 
    }
});

const transactionDB = mongoose.createConnection('mongodb://localhost:27017/transactions', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



// Create a schema for the "transactions" collection
const transactionSchema = new mongoose.Schema({
    transaction_id: String,
    paid_by: String,
    amount: Number,
    created_at: Date,
    created_by: String,
    modified_at: Date,
    modified_by: String,
    transaction_title: String,
    group_id: String,
    paidFor: [
        {
            userUUID: String,
            amountOwed: Number,
        }
    ]
});

// Create a model based on the schema for the "transactions" collection
const Transaction = transactionDB.model('Transaction', transactionSchema);

// Define an Express route to fetch data from the "transactions" collection
router.get('/getTransactionByGroupId/:groupId', async (req, res) => {
    try {
        // Fetch data from the "transactions" collection using the model
        const { groupId } = req.params;
        let transactionData = await Transaction.find({group_id: groupId});
        console.log(transactionData);
        // Sending fetched data from the "transactions" collection as a JSON response
        res.json(transactionData);
    } catch (error) {
        res.status(500).send(error.message); // Handling errors
    }
});

router.post('/addTransaction', async (req, res) => {
    try {
        const newTransactionData = req.body; // Assuming the request body contains the data for the new transaction

        const newTransaction = new Transaction(newTransactionData);
        await newTransaction.save();

        res.json(newTransaction);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/deleteTransaction/:transactionId', async (req, res) => {
    try {
        const { transactionId } = req.params;

        console.log('Received transactionId:', transactionId);

        const deletedTransaction = await Transaction.findOneAndDelete({transaction_id: transactionId});

        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(deletedTransaction);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error.message);
    }
});

router.patch('/updateTransaction/:transactionId', async (req, res) => {
    try {
        const { transactionId } = req.params;
        const updates = req.body; // Assuming the request body contains the fields to be updated

        const updatedTransaction = await Transaction.findOneAndUpdate(
            {transaction_id: transactionId},
            { $set: updates },
            { new: true } // To return the updated document
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



module.exports = router;
