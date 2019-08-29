const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', '/html', 'Success.html'));
})

module.exports = router;