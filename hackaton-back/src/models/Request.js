const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }, // Cantidad ofrecida
    price: { type: Number, required: true }, // Precio ofrecido por unidad
    comment: { type: String, default: '' }, // Comentario opcional
    status: {
        type: String,
        enum: ['pendiente', 'aceptada', 'rechazada'],
        default: 'pendiente' // Estado inicial de la oferta
    }
});

const requestSchema = new mongoose.Schema({
    requestType: {
        type: String,
        enum: ['compra', 'venta'],
        required: true
    },
    product: {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    },
    description: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['activa', 'cerrada'],
        default: 'activa'
    },
    offers: [offerSchema] // Lista de subdocumentos de ofertas
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
