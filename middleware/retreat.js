function retreat(req, res, next){
    const retreat_id = req.headers['retreat_id'];

    if(!retreat_id) {
        return res.status(400).json({ msg: "You need to select a retreat." });
    }

    req.retreat_id = retreat_id;
    next();
}

module.exports = retreat;