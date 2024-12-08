const authService = require('../services/AuthService');

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, confirmPassword, role } = req.body;

            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
            }

            const user = await authService.register({ name, email, password, role });
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {   
            const { email, password } = req.body;
            // Autenticar usuario y generar token
            const { token, userInfo } = await authService.login(email, password);



            res.cookie('session', JSON.stringify({ token, name: userInfo.name, email: userInfo.email, role: userInfo.role }), {

                httpOnly: false,
                secure: true,
                sameSite: 'none',
                maxAge: 60 * 60 * 1000,
            });
   
            return res.status(200).json({ token, message: 'Inicio de sesión exitoso.', userInfo });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async logout(req, res) {
        try {

            res.clearCookie('token');
            res.clearCookie('session');
            res.status(200).json({ message: 'Logout exitoso.' });
        } catch (error) {
            res.status(500).json({ message: 'Error al cerrar sesión.' });
        }
    }

    
}

module.exports = new AuthController();
