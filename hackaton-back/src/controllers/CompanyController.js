const companyService = require('../services/CompanyService');

class CompanyController {
    // Listar todas las empresas
    async getCompanies(req, res) {
        try {
            const companies = await companyService.getAllCompanies();
            res.status(200).json({
                message: "Lista de empresas obtenida exitosamente",
                data: companies
            });
        } catch (error) {
            console.error("Error al obtener empresas: ", error);
            res.status(500).json({ message: "Error del servidor al obtener empresas" });
        }
    }

    // Obtener una empresa por ID
    async getCompany(req, res) {
        try {

            const { id } = req.params;
            const company = await companyService.getCompanyById(id);

            res.status(200).json({
                message: "Empresa obtenida exitosamente",
                data: company
            });
        } catch (error) {
            console.error("Error al obtener la empresa: ", error);

            if (error.kind === "ObjectId") {
                return res.status(400).json({ message: "ID inválido" });
            }

            res.status(500).json({ message: "Error del servidor al obtener la empresa" });
        }
    }

    async getCompanyByUserId(req, res) {
        try {
            const { userId } = req.params;
            const company = await companyService.getCompanyByUserId(userId);

            res.status(200).json({
                message: "Empresa obtenida exitosamente",
                data: company
            });
        } catch (error) {
            console.error("Error al obtener la empresa: ", error);

            if (error.kind === "ObjectId") {
                return res.status(400).json({ message: "ID inválido" });
            }

            res.status(500).json({ message: "Error del servidor al obtener la empresa" });
        }
    }

    // Guardar una nueva empresa
    async saveCompany(req, res) {
        try {

            const companyData = req.body;
            const newCompany = await companyService.createCompany(companyData);

            await newCompany.save();
            res.status(201).json({ message: "Empresa registrada exitosamente", data: newCompany });
        } catch (error) {
            console.error("Error al guardar la empresa: ", error);

            if (error.code === 11000) {
                return res.status(400).json({ message: "El NIT ya está registrado" });
            }

            res.status(500).json({ message: "Error del servidor al guardar la empresa" });
        }
    }

    // Eliminar una empresa por ID
    async deleteCompany(req, res) {
        try {
            
            const { id } = req.params;
            const deletedCompany = await companyService.deleteCompanyById(id);

            res.status(200).json({
                message: "Empresa eliminada exitosamente",
                data: deletedCompany
            });
        } catch (error) {
            console.error("Error al eliminar la empresa: ", error);

            if (error.kind === "ObjectId") {
                return res.status(400).json({ message: "ID inválido" });
            }

            res.status(500).json({ message: "Error del servidor al eliminar la empresa" });
        }
    }

    async updateCompany(req, res) {
        try {
            const { id } = req.params; // ID de la empresa a actualizar
            const updateData = req.body; // Datos para la actualización
            
            const updatedCompany = await companyService.updateCompany(id, updateData);

            res.status(200).json({
                message: "Empresa actualizada exitosamente",
                data: updatedCompany,
            });
        } catch (error) {
            console.error("Error al actualizar la empresa:", error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new CompanyController();
