const supplierRepository = require('../repositories/SupplierRepository');
const PeasantRepository = require('../repositories/PeasantRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const SupplierRepository = require('../repositories/SupplierRepository');

class SupplierService {
    // Listar todos los proveedores
    async getAllSuppliers() {
        return await supplierRepository.findAll();
    }

    // Obtener un proveedor por ID
    async getSupplierById(id) {
        const supplier = await supplierRepository.findById(id);
        if (!supplier) {
            throw new Error("Proveedor no encontrado");
        }
        return supplier;
    }

    async getSupplierByUserId(userId) {
        const supplier = await supplierRepository.findByUserId(userId);

        if (!supplier) {
            throw new Error("Proveedor no encontrado");
        }

        return supplier;
    }

    // Crear un nuevo proveedor
    async createSupplier(supplierData) {
        const { supplierName, nit, contactPhone, address, ubication, userId } = supplierData;

        if (!supplierName || !nit || !contactPhone || !address || !ubication || !ubication.latitude || !ubication.longitude || !userId) {
            throw new Error("Campos obligatorios faltantes");
        }

        const peasantFound = await PeasantRepository.findByUserId(userId);
        const companyFound = await CompanyRepository.findByUserId(userId);
        const supplierFound = await supplierRepository.findByUserId(userId);

        if (peasantFound || companyFound || supplierFound) {
            throw new Error("Usuario ya registrado");
        }

        return await supplierRepository.create({
            supplierName,
            nit,
            contactPhone,
            address,
            ubication,
            productsOffered: supplierData.productsOffered || [],
            coverageAreas: supplierData.coverageAreas || [],
            transportAvailability: supplierData.transportAvailability || false,
            user: userId,
        });
    }

    // Eliminar un proveedor por ID
    async deleteSupplierById(id) {
        const deletedSupplier = await supplierRepository.deleteById(id);
        if (!deletedSupplier) {
            throw new Error("Proveedor no encontrado");
        }
        return deletedSupplier;
    }

    // Agregar un producto ofrecido a un proveedor
    async addProductToSupplier(supplierId, product) {
        const supplier = await supplierRepository.findById(supplierId);
        if (!supplier) {
            throw new Error("Proveedor no encontrado");
        }
        if (!product.name || !product.price || !product.quantity) {
            throw new Error("Información del producto incompleta");
        }
        return await supplierRepository.addProduct(supplierId, product);
    }

    // Eliminar un producto ofrecido de un proveedor
    async removeProductFromSupplier(supplierId, productId) {
        const supplier = await supplierRepository.findById(supplierId);
        if (!supplier) {
            throw new Error("Proveedor no encontrado");
        }
        const productExists = supplier.productsOffered.some(
            product => product._id.toString() === productId
        );
        if (!productExists) {
            throw new Error("Producto no encontrado en la lista del proveedor");
        }
        return await supplierRepository.removeProduct(supplierId, productId);
    }

    async updateSupplier(id, updateData) {
        // Evitar actualizaciones en campos no permitidos
        delete updateData._id;
        delete updateData.productsOffered;

        const updatedSupplier = await supplierRepository.update(id, updateData);

        if (!updatedSupplier) {
            throw new Error("Proveedor no encontrado");
        }

        return updatedSupplier;
    }
}

module.exports = new SupplierService();
