const express = require('express');
const router = express.Router();
const refreshTokenMiddleware = require('../middleware/tokenAuth');
const User = require('../config/models');
const request = require('request');
const ouraConfig = require('../config/oura');
const OURA_CLIENT_ID = process.env.OURA_CLIENT_ID;
const OURA_CLIENT_SECRET = process.env.OURA_CLIENT_SECRET;

router.post('/refresh-token', refreshTokenMiddleware, (req, res) => {

    const { retreat_id, client_id, refresh_token } = JSON.parse(req.body);

    if(!retreat_id || !client_id || !refresh_token) {
        return res.status(400).json({ msg: "Please provide client and retreat id with refresh token." });
    }

    User.findOne()
        .then(user => {
            var retreat = user.retreats.id(retreat_id);
            if(!retreat){
                return res.status(400).json({
                    msg: "The retreat id you provided is invalid",
                    retreat,
                    retreat_id
                });
            }

            var client = retreat.clients.id(client_id);
            if(!client) {
                return res.status(400).json({
                    msg: "The client id you provided is invalid",
                    client,
                    client_id
                });
            }

            var options = {
                method: 'POST',
                url: ouraConfig.accessTokenUri,
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                form: {
                    grant_type: 'refresh_token',
                    client_id: OURA_CLIENT_ID,
                    client_secret: OURA_CLIENT_SECRET,
                    refresh_token
                }
            };
              
            request(options, function (err, response, body) {
                if(err){
                    console.log(err);
                    return res.status(500).json({ msg: "Something went wrong while making request for your refresh token." })
                }
                
                const b = JSON.parse(body);

                if(b.code > 399){
                    return res.status(400).json({ msg: "Something went wrong trying to refresh your token, it is probably an invalid or expired token." });
                }
                
                const { access_token, refresh_token } = b;
        
                client.oura_api.oura_access_token = access_token;
                client.oura_api.oura_refresh_token = refresh_token;
                user.save()
                    .then(() => {
                        return res.status(200).json({ msg: 'Success!' });
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({ msg: "There was a problem while saving document to MongoDB Atlas. Check logs for more details." });
                    })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "There was a problem looking for the root user in MongoDB Atlas. Check logs for more details." });
        })
})

module.exports = router;