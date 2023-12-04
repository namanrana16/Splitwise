const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const users = require('./users');
const groups = require('./groups');
const transactions = require('./transactions')
const transactionDocs = require('./transactionDocs')


app.use(express.json());
app.use('/users', users);
app.use('/groups', groups);
app.use('/transactions', transactions);
app.use('/transactionDocs', transactionDocs);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});