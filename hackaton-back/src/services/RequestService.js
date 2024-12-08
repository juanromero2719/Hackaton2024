const requestRepository = require('../repositories/RequestRepository');
const UserRepository = require('../repositories/UserRepository');
const PeasantRepository = require('../repositories/PeasantRepository');
const CompanyRepository = require('../repositories/CompanyRepository');
const SupplierRepository = require('../repositories/SupplierRepository');
const geolib = require('geolib');

class RequestService {
    async createRequest(requestData) {

        const userId = requestData.user;
        const userFound = await UserRepository.findById(userId)
  
        if(!userFound){
            throw new Error('Usuario no encontrado');
        }

        return await requestRepository.create(requestData);
    }

    async getAllRequests() {
        return await requestRepository.findAll();
    }

    async getRequestById(id) {
        // Validar ID si es necesario
        if (!id) {
            throw new Error('ID inválido');
        }

        const request = await requestRepository.findById(id);
        if (!request) {
            throw new Error('Solicitud no encontrada');
        }

        return request;
    }

    async deleteRequestById(id) {
        
        if (!id) {
            throw new Error('ID inválido');
        }

        const deletedRequest = await requestRepository.deleteById(id);
        if (!deletedRequest) {
            throw new Error('Solicitud no encontrada');
        }

        return deletedRequest;
    }


    async filterByLocation(latitude, longitude, radiusKm) {
        const allRequests = await requestRepository.findAll();

        console.log(`latitude: ${latitude}, longitude: ${longitude}, radiusKm: ${radiusKm}`);

        const filteredRequests = [];

        for (const request of allRequests) {
            const userId = request.user;

            // Obtener ubicación del usuario
            const userLocation = await this.getUserUbication(userId);

            if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
                console.warn(`Usuario ${userId} no tiene una ubicación válida. Omitiendo solicitud.`);
                continue; // Saltar solicitudes sin ubicación válida
            }

            console.log(`Ubicación del usuario ${userId}:`, userLocation);

            const distance = geolib.getDistance(
                { latitude, longitude },
                { latitude: userLocation.latitude, longitude: userLocation.longitude }
            );

            // Convertir distancia a kilómetros y verificar si está dentro del radio
            if (distance / 1000 <= radiusKm) {
                filteredRequests.push({ request, distance: distance / 1000 }); // Guardar la solicitud con su distancia
            }
        }

        return filteredRequests;
    }

    async getClosestRequests(latitude, longitude, limit = 5) {
        const allRequests = await requestRepository.findAll();
        const requestsWithDistance = [];

        for (const request of allRequests) {
            const userId = request.user;

            // Obtener ubicación del usuario
            const userLocation = await this.getUserUbication(userId);

            if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
                console.warn(`Usuario ${userId} no tiene una ubicación válida. Omitiendo solicitud.`);
                continue; // Saltar solicitudes sin ubicación válida
            }

            const distance = geolib.getDistance(
                { latitude, longitude },
                { latitude: userLocation.latitude, longitude: userLocation.longitude }
            );

            requestsWithDistance.push({ request, distance: distance / 1000 }); // Agregar solicitud con su distancia
        }

        // Ordenar por distancia ascendente y devolver las más cercanas
        return requestsWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, limit); // Limitar a las `N` más cercanas
    }

    // Método para obtener la ubicación del usuario basado en el tipo
    async getUserUbication(userId) {
        let user = await PeasantRepository.findByUserId(userId);
        if (user && user.ubication) return user.ubication;

        user = await CompanyRepository.findByUserId(userId);
        if (user && user.ubication) return user.ubication;

        user = await SupplierRepository.findByUserId(userId);
        if (user && user.ubication) return user.ubication;

        // Si no se encuentra en ninguno de los repositorios
        return null;
    }
}

module.exports = new RequestService();
