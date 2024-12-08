const mongoose = require('mongoose');

// Sub-esquema para productos ofrecidos
const productOfferedSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nombre del producto
    price: { type: Number, required: true }, // Precio estimado por unidad, volumen o peso
    quantity: { type: Number, required: true }, // Cantidad ofrecida
});

// Esquema principal para el proveedor
const supplierSchema = new mongoose.Schema({
    supplierName: { type: String, required: true }, // Nombre del proveedor o empresa
    nit: { type: String, required: true, unique: true }, // Identificación tributaria
    contactPhone: { type: String, required: true }, // Teléfono de contacto
    address: { type: String, required: true }, // Dirección física
    ubication: {
        latitude: { type: Number, required: true }, // Latitud de la ubicación
        longitude: { type: Number, required: true }, // Longitud de la ubicación
    },
    productsOffered: { type: [productOfferedSchema], default: [] }, // Lista de productos ofrecidos
    coverageAreas: { type: [String], default: [] }, // Zonas o municipios donde ofrecen servicio
    transportAvailability: { type: Boolean, default: false }, // Si cuentan con logística para entregar productos
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario asociado
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
