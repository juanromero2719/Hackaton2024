const userRepository = require('../repositories/UserRepository');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await userRepository.getAll();
            res.status(200).json(users); // Responde con el listado de usuarios
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Internal Server Error' }); // Manejo de errores
        }
    }
}

module.exports = new UserController();
