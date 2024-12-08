const supplierService = require('../services/SupplierService');

class SupplierController {
    // Listar todos los proveedores
    async getSuppliers(req, res) {
        try {

            const suppliers = await supplierService.getAllSuppliers();

            res.status(200).json({
                message: "Lista de proveedores obtenida exitosamente",
                data: suppliers
            });
        } catch (error) {
            console.error("Error al obtener proveedores: ", error);
            res.status(500).json({ message: "Error del servidor al obtener proveedores" });
        }
    }

    // Obtener un proveedor por ID
    async getSupplier(req, res) {
        try {

            const { id } = req.params;
            const supplier = await supplierService.getSupplierById(id);

            res.status(200).json({
                message: "Proveedor obtenido exitosamente",
                data: supplier
            });
        } catch (error) {
            console.error("Error al obtener el proveedor: ", error);

            if (error.kind === "ObjectId") {
                return res.status(400).json({ message: "ID inválido" });
            }

            res.status(500).json({ message: "Error del servidor al obtener el proveedor" });
        }
    }

    async getSupplierByUserId(req, res) {
        try {
            const { userId } = req.params;
            const supplier = await supplierService.getSupplierByUserId(userId);
            res.status(200).json({
                message: "Proveedor obtenido exitosamente",
                data: supplier
            });
        } catch (error) {
            console.error("Error al obtener el proveedor: ", error);
            res.status(500).json({ message: "Error del servidor al obtener el proveedor" });
        }
    }

    // Crear un nuevo proveedor
    async saveSupplier(req, res) {
        try {

            const supplierData = req.body;
            const newSupplier = await supplierService.createSupplier(supplierData);

            res.status(201).json({ message: "Proveedor registrado exitosamente", data: newSupplier });
        } catch (error) {
            console.error("Error al guardar el proveedor: ", error);

            if (error.code === 11000) {
                return res.status(400).json({ message: "El NIT ya está registrado" });
            }

            res.status(500).json({ message: "Error del servidor al guardar el proveedor" });
        }
    }

    // Eliminar un proveedor
    async deleteSupplier(req, res) {
        try {

            const { id } = req.params;
            const deletedSupplier = await supplierService.deleteSupplierById(id);

            res.status(200).json({
                message: "Proveedor eliminado exitosamente",
                data: deletedSupplier
            });
        } catch (error) {
            console.error("Error al eliminar el proveedor: ", error);

            if (error.kind === "ObjectId") {
                return res.status(400).json({ message: "ID inválido" });
            }

            res.status(500).json({ message: "Error del servidor al eliminar el proveedor" });
        }
    }

    async addProduct(req, res) {
        try {
            const { supplierId } = req.params;
            const product = req.body;
            const updatedSupplier = await supplierService.addProductToSupplier(supplierId, product);
            res.status(200).json({
                message: "Producto agregado exitosamente",
                data: updatedSupplier
            });
        } catch (error) {
            console.error("Error al agregar el producto: ", error);
            res.status(400).json({ message: error.message });
        }
    }

    // Eliminar un producto ofrecido de un proveedor
    async removeProduct(req, res) {
        try {
            const { supplierId, productId } = req.params;
            const updatedSupplier = await supplierService.removeProductFromSupplier(supplierId, productId);
            res.status(200).json({
                message: "Producto eliminado exitosamente",
                data: updatedSupplier
            });
        } catch (error) {
            console.error("Error al eliminar el producto: ", error);
            res.status(400).json({ message: error.message });
        }
    }

    async updateSupplier(req, res) {
        try {
            const { id } = req.params; // ID del proveedor a actualizar
            const updateData = req.body; // Datos para la actualización
            
            const updatedSupplier = await supplierService.updateSupplier(id, updateData);

            res.status(200).json({
                message: "Proveedor actualizado exitosamente",
                data: updatedSupplier,
            });
        } catch (error) {
            console.error("Error al actualizar el proveedor:", error);
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new SupplierController();
