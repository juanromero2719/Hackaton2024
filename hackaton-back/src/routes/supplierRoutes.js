const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/SupplierController');
const roleMiddleware = require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

// Listar todos los proveedores
router.get('/suppliers', authMiddleware, (req, res) => {
    // #swagger.tags = ['Suppliers']
    supplierController.getSuppliers(req, res);
});

// Obtener un proveedor por ID
router.get('/supplier/:id', authMiddleware, (req, res) => {
    // #swagger.tags = ['Suppliers']
    supplierController.getSupplier(req, res);
});

router.get('/suppliers/user/:userId', authMiddleware, (req, res) => {
    // #swagger.tags = ['Suppliers']
    supplierController.getSupplierByUserId(req, res);
});

// Crear un nuevo proveedor
router.post('/supplier', authMiddleware, roleMiddleware(['administrador', 'proveedor']), (req, res) => {
    // #swagger.tags = ['Suppliers']
    supplierController.saveSupplier(req, res);
});

// Eliminar un proveedor por ID
router.delete('/supplier/:id', authMiddleware, roleMiddleware(['administrador']), (req, res) => {
    // #swagger.tags = ['Suppliers']
    supplierController.deleteSupplier(req, res);
});

router.post('/suppliers/:supplierId/products', authMiddleware, (req, res) => {
    // #swagger.tags = ['Suppliers']
    supplierController.addProduct(req, res);
});

router.delete('/suppliers/:supplierId/products/:productId', authMiddleware, (req, res) => {
    // #swagger.tags = ['Suppliers']
    supplierController.removeProduct(req, res);
});

router.put('/supplier/:id', authMiddleware, roleMiddleware(['administrador', 'proveedor']), (req, res) => {
    // #swagger.tags = ['Suppliers']
    supplierController.updateSupplier(req, res);
});


module.exports = router;
