const companyRepository = require('../repositories/CompanyRepository');
const PeasantRepository = require('../repositories/PeasantRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const SupplierRepository = require('../repositories/SupplierRepository');

class CompanyService {
    // Obtener todas las empresas
    async getAllCompanies() {
        return await companyRepository.findAll();
    }

    // Obtener una empresa por ID
    async getCompanyById(id) {
        const company = await companyRepository.findById(id);

        if (!company) {
            throw new Error("Empresa no encontrada");
        }

        return company;
    }

    async getCompanyByUserId(userId) {
        const company = await companyRepository.findByUserId(userId);

        if (!company) {
            throw new Error("Empresa no encontrada");
        }

        return company;
    }

    // Crear una nueva empresa
    async createCompany(companyData) {
        const { companyName, nit, contact, ubication, userId } = companyData;

        if (!companyName || !nit || !contact || !ubication || !ubication.latitude || !ubication.longitude || !userId) {
            throw new Error("Campos obligatorios faltantes");
        }

        const peasantFound = await PeasantRepository.findByUserId(userId);
        const supplierFound = await SupplierRepository.findByUserId(userId);
        const companyFound = await companyRepository.findByUserId(userId);

        if (peasantFound || supplierFound || companyFound) {
            throw new Error("Usuario ya registrado");
        }

        return await companyRepository.create({
            companyName,
            nit,
            contact,
            ubication,
            user: userId,
        });
    }

    // Eliminar una empresa por ID
    async deleteCompanyById(id) {
        const deletedCompany = await companyRepository.deleteById(id);

        if (!deletedCompany) {
            throw new Error("Empresa no encontrada");
        }

        return deletedCompany;
    }

    async updateCompany(id, updateData) {
        // Evitar actualizaciones en campos no permitidos
        delete updateData._id;

        const updatedCompany = await companyRepository.update(id, updateData);

        if (!updatedCompany) {
            throw new Error("Empresa no encontrada");
        }

        return updatedCompany;
    }
}

module.exports = new CompanyService();
