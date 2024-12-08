const chatService = require('../services/ChatService');

class ChatController {
    async chat(req, res) {
        try {
            const { message, context } = req.body;
            if (!message) {
                return res.status(400).json({ message: 'Debe proporcionar un mensaje.' });
            }

            const response = await chatService.generateResponse(message, context);
            res.status(200).json({ response });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ChatController();
