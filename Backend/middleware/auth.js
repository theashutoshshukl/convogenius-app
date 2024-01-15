const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Dotenv config
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const auth = (req, res, next) => {
    const token = req.header("Authorization");
    try {
        // Checking token is awailabe or not
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Please login" });
        }
        // Decoding token
        const decodedToekn = jwt.verify(token, SECRET_KEY);
        req.userId = decodedToekn.id;

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = auth;