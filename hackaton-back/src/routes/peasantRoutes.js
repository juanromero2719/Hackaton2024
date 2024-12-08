const express = require('express');
const router = express.Router();
const roleMiddleware = require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware"); // Controlador de autenticación
const peasantController = require('../controllers/PeasantController');

// obtener todos los campesinos
router.get('/peasants', authMiddleware,  (req, res) => {
    // #swagger.tags = ['Peasants']
    peasantController.getPeasants(req, res);
});

// obtener campesino por id
router.get('/peasant/:id',authMiddleware,  (req, res) => {
    // #swagger.tags = ['Peasants']
    peasantController.getPeasant(req, res);
});

router.get('/peasant/user/:userId', authMiddleware, (req, res) => {
    // #swagger.tags = ['Peasants']
    peasantController.getPeasantByUserId(req, res);
});

// Ruta de registro campesino
router.post('/save/peasant', authMiddleware, (req, res) => {
    // #swagger.tags = ['Peasants']
    peasantController.savePeasant(req, res);
});

router.delete('/peasant/:id', authMiddleware, roleMiddleware(['administrador']), (req, res) => {
    // #swagger.tags = ['Peasants']
    peasantController.deletePeasant(req, res);
});

router.post('/peasants/:peasantId/products', authMiddleware, roleMiddleware(['administrador', 'agricultor']), (req, res) => {
    // #swagger.tags = ['Peasants']
    peasantController.addProduct(req, res);
});

// Eliminar un producto de un campesino
router.delete('/peasants/:peasantId/products/:productId', authMiddleware, roleMiddleware(['administrador', 'agricultor']),  (req, res) => {
    // #swagger.tags = ['Peasants']
    peasantController.removeProduct(req, res);
});

router.put('/peasant/:id', authMiddleware, roleMiddleware(['administrador', 'agricultor']), (req, res) => {
    // #swagger.tags = ['Peasants']
    peasantController.updatePeasant(req, res);
});

module.exports = router;
