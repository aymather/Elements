const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../config/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.get('/user', authMiddleware, (req, res) => {
    User.findById(req.user.id)
        .select('-retreats')
        .then(user => {
            res.json({ user });
        })
        .catch(e => {
            res.status(400).json({ msg: "Unable to find a user with that ID" });
        })
})

router.post('/login', (req, res) => {
    const { password } = req.body;
    
    if(!password){
        return res.status(400).json({ msg: 'Enter all fields' });
    }

    User.findOne()
        .then(user => {
            if(!user) return res.status(400).json({ msg: 'No existing user in the database' });
            
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    // Invalid password
                    if(!isMatch) return res.status(400).json({ msg: "Invalid password"});

                    jwt.sign(
                        { id: user.id },
                        JWT_SECRET,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) return res.status(500).json({ msg: "Error signing jsonwebtoken" });
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    username: user.username,
                                    retreats: user.retreats
                                }
                            })
                        }
                    )
                })
        })
        .catch(err => {
            res.json({ msg: "Not Found" });
        })
})

module.exports = router;