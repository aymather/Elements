const express = require('express');
const { PORT } = require('./config/keys');
const bodyParser = require('body-parser');
const path = require('path');
const env = require('dotenv').config();

// Init app
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes directory
app.use('/', require('./routes/user'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, err => {
    if(err) throw new Error(err);

    console.log(`Now listening on port ${PORT}`)
})