const Supplier = require('../models/Supplier');

class SupplierRepository {
    // Listar todos los proveedores
    async findAll() {
        return await Supplier.find().populate('user', 'name email role');
    }

    // Obtener un proveedor por ID
    async findById(id) {
        return await Supplier.findById(id).populate('user', 'name email role');
    }

    async findByUserId(userId) {
        return await Supplier.findOne({ user: userId });
    }

    // Crear un nuevo proveedor
    async create(supplierData) {
        const supplier = new Supplier(supplierData);
        return await supplier.save();
    }

    // Eliminar un proveedor por ID
    async deleteById(id) {
        return await Supplier.findByIdAndDelete(id);
    }

    // Agregar un producto ofrecido a un proveedor
    async addProduct(supplierId, product) {
        return await Supplier.findByIdAndUpdate(
            supplierId,
            { $push: { productsOffered: product } },
            { new: true }
        );
    }

    // Eliminar un producto ofrecido de un proveedor
    async removeProduct(supplierId, productId) {
        return await Supplier.findByIdAndUpdate(
            supplierId,
            { $pull: { productsOffered: { _id: productId } } },
            { new: true }
        );
    }

    async update(id, updateData) {
        return await Supplier.findByIdAndUpdate(id, updateData, { new: true });
    }
}

module.exports = new SupplierRepository();
