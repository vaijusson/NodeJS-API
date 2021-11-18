/* eslint-disable no-undef */
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const CORS = require('cors');
const chalk = require('chalk');
const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var MongoDB = '';
if (process.env.ENV === 'Test') 
{
    MongoDB = "mongodb+srv://ckmobile:Hello123$@cluster0.lquhb.mongodb.net/node-api-test?retryWrites=true&w=majority";
}
else {
    MongoDB = "mongodb+srv://ckmobile:Hello123$@cluster0.lquhb.mongodb.net/node-api?retryWrites=true&w=majority";
}

console.log(`DB is ${MongoDB}`);

const db = mongoose.connect(MongoDB, {
    useUnifiedTopology: true, useNewUrlParser: true
})
.then(() => console.log(chalk.green('connected to Atlas')))
.catch(err => console.log(chalk.red(err)));

// const Book = require('./models/bookModel');
// const bookRouter = require('./routes/bookRouter');

const corsOptions = {
    origin: 'http://localhost:' + PORT + '/',
    credentials: false,
    optionSuccessStatus: 200
}

app.use(CORS(corsOptions));
//these two are used for doing POST to Books via Mongoose
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());







app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('Hello API');
})

app.server = app.listen(PORT, () => {
    console.log(`Running on ${chalk.green(PORT)}`);
})

module.exports = app;