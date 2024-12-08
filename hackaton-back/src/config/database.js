const {connect} = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        console.error('Error al conectar con MongoDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;
