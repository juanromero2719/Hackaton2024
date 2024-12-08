const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {

        const sessionCookie2 = req.cookies.session;
        const sessionData = JSON.parse(sessionCookie2);
        const jwt_key = process.env.JWT_KEY

        console.log("---------------")
        console.log('Session PARSED: ', sessionData.token)
        console.log('Jwt Key: ', jwt_key);
        console.log("---------------")

        const decoded = jwt.verify(sessionData.token, jwt_key);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
