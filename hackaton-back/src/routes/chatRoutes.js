const express = require('express');
const router = express.Router();
const chatController = require('../controllers/ChatController');
const authMiddleware = require("../middlewares/authMiddleware");

// Ruta principal para interactuar con el chat
router.post('/chat', authMiddleware, (req, res) => {
    // #swagger.tags = ['Chat']
    chatController.chat(req, res);
});

module.exports = router;
