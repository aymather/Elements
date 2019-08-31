const REFRESH_TOKEN_API_KEY = process.env.REFRESH_TOKEN_API_KEY;

module.exports = tokenAuth = (req, res, next) => {

    const key = req.headers['x-auth-api-key'];

    if(!key) {
        return res.status(400).json({ msg: "No api key present in request" });
    }

    if(key !== REFRESH_TOKEN_API_KEY) {
        return res.status(400).json({ msg: "Invalid API key" });
    }

    next();
    
}