
const requestRepository = require('../repositories/RequestRepository');
const UserRepository = require('../repositories/UserRepository');

class OfferService {

    async createOffer({ requestId, userId, amount, price }) {

        if (!requestId || !userId || !amount || !price) {
            throw new Error("Campos obligatorios faltantes");
        }

        const userFound = await UserRepository.findById(userId)
  
        if(!userFound){
            throw new Error('Usuario no encontrado');
        }

        const request = await requestRepository.findById(requestId);

        if (!request) {
            throw new Error("Solicitud no encontrada");
        }

        if (request.status === 'cerrada') {
            throw new Error("No se pueden agregar ofertas a solicitudes cerradas");
        }

        const availableQuantity = request.product.quantity;

        if (amount > availableQuantity) {
            throw new Error(
                `La cantidad ofrecida (${amount}) excede la cantidad disponible (${availableQuantity}).`
            );
        }

        const newOffer = { user: userId, amount, price };
        request.offers.push(newOffer);

        console.log("Oferta a guardar:", newOffer);
        console.log("Ofertas del request:", request.offers);
                
        await requestRepository.save(request);


        return newOffer;
    }

    async getOffersByRequest(requestId) {
        const request = await requestRepository.findByIdWithOffers(requestId);

        if (!request) {
            throw new Error("Solicitud no encontrada");
        }

        return request.offers;
    }

    async deleteOffer(requestId, offerId) {
        const request = await requestRepository.findById(requestId);

        if (!request) {
            throw new Error("Solicitud no encontrada");
        }

        const offerIndex = request.offers.findIndex(offer => offer._id.toString() === offerId);

        if (offerIndex === -1) {
            throw new Error("Oferta no encontrada");
        }

        request.offers.splice(offerIndex, 1);

        await requestRepository.save(request);
    }

    async updateOfferStatus({ requestId, offerId, status }) {
        if (!['pendiente', 'aceptada', 'rechazada'].includes(status)) {
            throw new Error('Estado inválido para la oferta');
        }

        return await requestRepository.updateOfferStatus(requestId, offerId, status);
    }
}

module.exports = new OfferService();
