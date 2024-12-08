const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const authMiddleware = require("../middlewares/authMiddleware"); // Controlador de autenticación

// Ruta de registro
router.post('/register', (req, res) => {
    // #swagger.tags = ['Authentication']
    authController.register(req, res);
});

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    // #swagger.tags = ['Authentication']
    authController.login(req, res);
});

// Ruta de cierre de sesión
router.post('/logout', authMiddleware, (req, res) => {
    // #swagger.tags = ['Authentication']
    authController.logout(req, res);
});

module.exports = router;
