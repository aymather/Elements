const express = require('express');
const router = express.Router();
const multer = require('multer');
const retreatMiddleware = require('../middleware/retreat');
const path = require('path');
const mkdirp = require('mkdirp');
const User = require('../config/models');


router.post('/upload-file', retreatMiddleware, (req, res) => {


    // We need to store where the file is located in the client model
    User.findOne()
        .then(user => {
            
            var client_id = req.headers['client_id'];
            if(!client_id){
                res.status(400).json({ msg: "Please include a client id" });
            }
            
            // Check for retreat directory
            var retreat_dir = path.resolve(`./public/uploads/${req.retreat_id}`);
            
            // Make sure that retreat exists
            var retreat = user.retreats.id(req.retreat_id);
            if(!retreat){
                return res.status(400).json({ msg: "Retreat does not exist" });
            }
            
            // Create the directory if it does exist and the directory
            // has not yet been created
            mkdirp.sync(retreat_dir);

            // Check for client directory
            var client_dir = path.join(retreat_dir, `/${client_id}`);

            // Check to make sure the client exists
            var client = retreat.clients.id(client_id);
            if(!client){
                return res.status(400).json({ msg: "That client doesn't exist" });
            }

            // If everything checks out, create the directory if it isn't
            // there already
            mkdirp.sync(client_dir);
            
            // Multer sorage config
            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, client_dir);
                },
                filename: function (req, file, cb) {
                    cb(null, file.originalname )
                }
            })

            // Create upload client
            var upload = multer({ storage }).single('file')

            upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err);
                } else if (err) {
                    return res.status(500).json(err);
                }

                // If everything goes as planned, we need to save the path
                // to that file in the client's database
                const path_from_root = `ftp/uploads/${req.retreat_id}/${client_id}`;
                client.files.push({
                    filename: req.file.filename,
                    path: path_from_root,
                    fullfile: path_from_root + '/' + req.file.filename
                })

                user.save()
                    .then(savedUser => {
                        const savedClient = savedUser.retreats.id(req.retreat_id).clients.id(client_id);
                        const file_details = savedClient.files[savedClient.files.length-1];
                        res.status(200).send(file_details);
                    })
                    .catch(() => {
                        res.status(500).json({ msg: "Trouble saving document to MongoDB Atlas" })
                    })
            })

    })
    .catch(() => {
        res.status(500).json({ msg: "Error searching MongoDB Atlas" })
    })

})

module.exports = router;