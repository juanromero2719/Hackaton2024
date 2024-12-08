const express = require('express');
const router = express.Router();
const companyController = require('../controllers/CompanyController');
const roleMiddleware = require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

// Listar todas las empresas
router.get('/companies', authMiddleware, (req, res) => {
    // #swagger.tags = ['Companies']
    companyController.getCompanies(req, res);
});

// Obtener una empresa por ID
router.get('/company/:id', authMiddleware, (req, res) => {
    // #swagger.tags = ['Companies']
    companyController.getCompany(req, res);
});

router.get('/company/user/:userId', authMiddleware, (req, res) => {
    // #swagger.tags = ['Companies']
    companyController.getCompanyByUserId(req, res);
});

// Guardar una nueva empresa
router.post('/company', authMiddleware, roleMiddleware(['administrador', 'empresa turistica']), (req, res) => {
    // #swagger.tags = ['Companies']
    companyController.saveCompany(req, res);
});

// Eliminar una empresa por ID
router.delete('/company/:id', authMiddleware, roleMiddleware(['administrador']), (req, res) => {
    // #swagger.tags = ['Companies']
    companyController.deleteCompany(req, res);
});

// Actualizar una empresa por ID
router.put('/company/:id', authMiddleware, roleMiddleware(['administrador', 'empresa turistica']), (req, res) => {
    // #swagger.tags = ['Companies']
    companyController.updateCompany(req, res);
});

module.exports = router;
