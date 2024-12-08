const requestService = require('../services/RequestService');

class RequestController {

    async createRequest(req, res) {

        try {

            const requestData = req.body;
            const newRequest = await requestService.createRequest(requestData);

            res.status(201).json({ message: "Solicitud creada exitosamente", data: newRequest });
        } catch (error) {
            console.error("Error al crear la solicitud: ", error);

            if (error.message === "Campos obligatorios faltantes") {
                return res.status(400).json({ message: error.message });
            }

            res.status(500).json({ message: "Error del servidor al crear la solicitud" });
        }
    }

    // Listar todas las solicitudes
    async getRequests(req, res) {
        try {

            const requests = await requestService.getAllRequests();

            res.status(200).json({
                message: "Lista de solicitudes obtenida exitosamente",
                data: requests
            });
        } catch (error) {
            console.error("Error al obtener solicitudes: ", error);
            res.status(500).json({ message: "Error del servidor al obtener solicitudes" });
        }
    }

    // Obtener una solicitud por ID
    async getRequest(req, res) {
        try {
            const { id } = req.params;
            const request = await requestService.getRequestById(id);
               
            res.status(200).json({
                message: "Solicitud obtenida exitosamente",
                data: request
            });
        } catch (error) {
            console.error("Error al obtener la solicitud: ", error);

            if (error.kind === "ObjectId") {
                return res.status(400).json({ message: "ID inválido" });
            }

            res.status(500).json({ message: "Error del servidor al obtener la solicitud" });
        }
    }

    // Eliminar una solicitud
    async deleteRequest(req, res) {
        try {
            const { id } = req.params;
            const deletedRequest = await requestService.deleteRequestById(id);

            if (!deletedRequest) {
                return res.status(404).json({ message: "Solicitud no encontrada" });
            }

            res.status(200).json({
                message: "Solicitud eliminada exitosamente",
                data: deletedRequest
            });
        } catch (error) {
            console.error("Error al eliminar la solicitud: ", error);

            if (error.kind === "ObjectId") {
                return res.status(400).json({ message: "ID inválido" });
            }

            res.status(500).json({ message: "Error del servidor al eliminar la solicitud" });
        }
    }

    async filterRequestsByLocation(req, res) {
        try {
            const { latitude, longitude, radiusKm } = req.query;

            console.log(`Controller: latitude: ${latitude}, longitude: ${longitude}, radiusKm: ${radiusKm}`);

            if (!latitude || !longitude) {
                return res.status(400).json({ message: "Faltan parámetros: latitude o longitude" });
            }

            // Reemplazar comas con puntos antes de convertir a número
            const lat = parseFloat(latitude.replace(',', '.'));
            const long = parseFloat(longitude.replace(',', '.'));

            if (isNaN(lat) || isNaN(long)) {
                return res.status(400).json({ message: "Los parámetros latitude y longitude deben ser números válidos." });
            }

            let filteredRequests;

            // Si no se proporciona radiusKm, devolver todas las solicitudes
            if (!radiusKm) {
                filteredRequests = await requestService.getAllRequests();
            } else {
                const radius = parseFloat(radiusKm.replace(',', '.'));
                if (isNaN(radius)) {
                    return res.status(400).json({ message: "El parámetro radiusKm debe ser un número válido." });
                }
                filteredRequests = await requestService.filterByLocation(lat, long, radius);
            }

            res.status(200).json({
                message: "Filtrado de solicitudes por ubicación exitoso",
                data: filteredRequests,
            });
        } catch (error) {
            console.error("Error al filtrar solicitudes por ubicación: ", error);
            res.status(500).json({ message: "Error del servidor" });
        }
    }

    async getClosestRequests(req, res) {
        try {
            const { latitude, longitude, limit } = req.query;

            console.log(`Controller: latitude: ${latitude}, longitude: ${longitude}, limit: ${limit}`);

            if (!latitude || !longitude) {
                return res.status(400).json({ message: "Faltan parámetros: latitude o longitude" });
            }

            const lat = parseFloat(latitude.replace(',', '.'));
            const long = parseFloat(longitude.replace(',', '.'));
            const closestLimit = limit ? parseInt(limit) : 5; // Limitar a 5 por defecto

            if (isNaN(lat) || isNaN(long)) {
                return res.status(400).json({ message: "Los parámetros latitude y longitude deben ser números válidos." });
            }

            const closestRequests = await requestService.getClosestRequests(lat, long, closestLimit);

            res.status(200).json({
                message: "Filtrado de solicitudes más cercanas exitoso",
                data: closestRequests,
            });
        } catch (error) {
            console.error("Error al filtrar solicitudes más cercanas: ", error);
            res.status(500).json({ message: "Error del servidor" });
        }
    }

}

module.exports = new RequestController();
