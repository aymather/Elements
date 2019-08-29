const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Init app
const app = express();

// Connect to DataBase
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => {
        console.log('Connected to database...');
    })
    .catch((err) => { 
        console.log(err);
    })

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes directory
app.use('/', require('./routes/user'));
app.use('/', require('./routes/clients'));

app.use(express.static(path.join(__dirname, 'public')));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, err => {
    if(err) throw new Error(err);

    console.log(`Now listening on port ${PORT}`)
})