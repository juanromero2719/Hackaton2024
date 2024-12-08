const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const authMiddleware = require("../middlewares/authMiddleware");

// Obtener todos los usuarios
router.get('/getUsers', authMiddleware, (req, res) => {
    // #swagger.tags = ['Administration']
    return adminController.getAllUsers(req, res);
})

module.exports = router;