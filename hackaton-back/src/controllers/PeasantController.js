const peasantService = require('../services/PeasantService');

class PeasantController {
    

    async getPeasants(req, res) {

        try {
            const peasants = await peasantService.getAllPeasants();
            res.status(200).json({
                message: "Lista de todos los campesinos obtenida exitosamente",
                data: peasants
            });
        } catch (error) {
            console.error("Error al obtener campesinos: ", error);
            res.status(500).json({ message: "Error del servidor al obtener campesinos" });
        }
    }

    async getPeasant(req, res) {
        try {

            const { id } = req.params;
            const peasant = await peasantService.getPeasantById(id); 
              
            res.status(200).json({
                message: "Campesino obtenido exitosamente",
                data: peasant
            });
        } catch (error) {
            console.error("Error al obtener el campesino: ", error); 
            res.status(500).json({ message: "Error del servidor al obtener el campesino" });
        }
    }

    async getPeasantByUserId(req, res) {
        try {
            const { userId } = req.params;
            const peasant = await peasantService.getPeasantByUserId(userId);

            res.status(200).json({
                message: "Campesino obtenido exitosamente",
                data: peasant
            });
        } catch (error) {
            console.error("Error al obtener el campesino: ", error);
            res.status(500).json({ message: "Error del servidor al obtener el campesino" });
        }
    }

    // Guardar un nuevo campesino
    async savePeasant(req, res) {
        try {

            const peasantData = req.body;
            const newPeasant = await peasantService.createPeasant(peasantData);       
            res.status(201).json({ message: "Campesino registrado exitosamente", data: newPeasant });
        } catch (error) {
            console.error("Error al guardar el campesino: ", error);
            res.status(500).json({ message: "Error del servidor" });
        }
    }

    // Eliminar un campesino por su ID
    async deletePeasant(req, res) {
        try {
            const { id } = req.params; // Extrae el ID de los parámetros de la ruta
            const deletedPeasant = await peasantService.deletePeasantById(id); // Elimina el campesino por su ID
            res.status(200).json({
                message: "Campesino eliminado exitosamente",
                data: deletedPeasant
            });
        } catch (error) {
            console.error("Error al eliminar el campesino: ", error);

            res.status(500).json({ message: "Error del servidor al eliminar el campesino" });
        }
    }

    async addProduct(req, res) {
        try {
            const { peasantId } = req.params;
            const product = req.body;

            const updatedPeasant = await peasantService.addProductToPeasant(peasantId, product);

            res.status(200).json({
                message: "Producto agregado exitosamente",
                data: updatedPeasant
            });
        } catch (error) {
            console.error("Error al agregar el producto: ", error);

            if (error.message === "Campesino no encontrado" || error.message === "Información del producto incompleta") {
                return res.status(400).json({ message: error.message });
            }

            res.status(500).json({ message: "Error del servidor al agregar el producto" });
        }
    }

    // Eliminar un producto de un campesino
    async removeProduct(req, res) {
        try {
            const { peasantId, productId } = req.params;

            const updatedPeasant = await peasantService.removeProductFromPeasant(peasantId, productId);

            res.status(200).json({
                message: "Producto eliminado exitosamente",
                data: updatedPeasant
            });
        } catch (error) {
            console.error("Error al eliminar el producto: ", error);

            if (error.message === "Campesino no encontrado" || error.message === "Producto no encontrado en la lista del campesino") {
                return res.status(400).json({ message: error.message });
            }

            res.status(500).json({ message: "Error del servidor al eliminar el producto" });
        }
    }

    async updatePeasant(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body; 
            
            const updatedPeasant = await peasantService.updatePeasant(id, updateData);

            res.status(200).json({
                message: "Campesino actualizado exitosamente",
                data: updatedPeasant,
            });
        } catch (error) {
            console.error("Error al actualizar el campesino:", error);
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new PeasantController();
