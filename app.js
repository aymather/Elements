const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const serveIndex = require('serve-index');

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

// Cors
app.use(cors());

// Routes directory
app.use('/', require('./routes/user'));
app.use('/', require('./routes/clients'));
app.use('/', require('./routes/retreats'));
app.use('/', require('./routes/groups'));
app.use('/', require('./routes/tokens'));
app.use('/', require('./routes/uploads'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/ftp', express.static('public/uploads'), serveIndex('public/uploads', {'icons':true}))

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