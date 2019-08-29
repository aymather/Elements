const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const retreatMiddleware = require('../middleware/retreat');
const User = require('../config/models');

router.get('/clients', authMiddleware, retreatMiddleware, (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            var clients = user.retreats.id(req.retreat_id).clients.map(client => {
                return {
                    id: client._id,
                    email: client.email,
                    oura_api: client.oura_api,
                    Metabolic_Type: client.Metabolic_Type,
                    firstname: client.firstname,
                    lastname: client.lastname,
                    Water_Intake: client.Water_Intake,
                    Macros: client.Macros,
                    data: client.data,
                    medications: client.medications,
                    gender: client.gender,
                    birthday: client.birthday,
                    sleep: null,
                    activity: null,
                    readiness: null,
                    isLoading: true
                }
            })
            return res.json({ clients: clients.reverse() });
        })
        .catch(() => {
            return res.status(500).json({ msg: "Internal server error"})
        })
})

module.exports = router;