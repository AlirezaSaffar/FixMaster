const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;


        next(); 
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

module.exports = authenticate;