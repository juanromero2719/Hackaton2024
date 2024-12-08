const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const userRepository = require('../repositories/UserRepository');
const jwtToken = require('jsonwebtoken');

class AuthService {

    async register(userData) {
        const { name, email, password, role } = userData;

        // Validar rol
        if (!['agricultor', 'proveedor', 'empresa turistica', 'administrador'].includes(role)) {
            throw new Error('El rol proporcionado no es válido');
        }

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.create({
            ...userData,
            password: hashedPassword,
        });

        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }

    async login(email, password) {
        
        const user = await userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Credenciales inválidas');
        }

        //const token = jwt.generateToken({ id: user.id, role: user.role });
        const token = await this.createAccessToken({ id: user.id, role: user.role});
        return {
            token,
            userInfo: { id: user.id, name: user.name, email: user.email, role: user.role },
        };
    }

    async createAccessToken(payload){

        return new Promise((resolve, reject) => { 

            jwtToken.sign(
       
                payload,
                process.env.JWT_KEY,
                {
                expiresIn: "1h",
                },
                (error, token) => {
                    
                    if (error) reject(error);
                    resolve(token)            
                }
            )    
        })
    }
}

module.exports = new AuthService();
