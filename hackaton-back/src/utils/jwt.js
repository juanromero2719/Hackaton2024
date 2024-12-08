const jwt = require('jsonwebtoken');

module.exports = {
    generateToken(payload) {
        return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '6h' });
    },

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_KEY);
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    },
};
