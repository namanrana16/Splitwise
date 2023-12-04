const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

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
    _id : String,
    transaction_id: String,
    transaction_type: String,
});

// Create a model based on the schema for the "transactions" collection
const Transaction = transactionDB.model('Transaction', transactionSchema);

// Define an Express route to fetch data from the "transactions" collection
router.get('/getLogs', async (req, res) => {
    try {
        // Fetch data from the "transactions" collection using the model

        const transactionData = await Transaction.find({});

        // Sending fetched data from the "transactions" collection as a JSON response
        res.json(transactionData);
    } catch (error) {
        res.status(500).send(error.message); // Handling errors
    }
});
module.exports = router;
