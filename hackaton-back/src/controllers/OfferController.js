const offerService = require('../services/OfferService');

class OfferController {
    // Crear una nueva oferta para una solicitud
    async createOffer(req, res) {
        try {

            const { requestId, userId, amount, price } = req.body;
            const newOffer = await offerService.createOffer({ requestId, userId, amount, price });

            res.status(201).json({ message: "Oferta creada exitosamente", data: newOffer });
        } catch (error) {
            console.error("Error al crear la oferta: ", error);
            res.status(500).json({ message: "Error del servidor al crear la oferta" });
        }
    }

    // Listar todas las ofertas de una solicitud
    async getOffersByRequest(req, res) {
        try {

            const { requestId } = req.params;
            const offers = await offerService.getOffersByRequest(requestId);

            res.status(200).json({
                message: "Lista de ofertas obtenida exitosamente",
                data: offers
            });
        } catch (error) {
            console.error("Error al obtener las ofertas: ", error);
            res.status(500).json({ message: "Error del servidor al obtener las ofertas" });
        }
    }

    async deleteOffer(req, res) {
        try {

            const { requestId, offerId } = req.params;
            await offerService.deleteOffer(requestId, offerId);

            res.status(200).json({ message: "Oferta eliminada exitosamente" });
        } catch (error) {
            console.error("Error al eliminar la oferta: ", error);
            res.status(500).json({ message: "Error del servidor al eliminar la oferta" });
        }
    }

    async updateOfferStatus(req, res) {
        try {
            const { requestId, offerId } = req.params;
            const { status } = req.body;

            const updatedRequest = await offerService.updateOfferStatus({ requestId, offerId, status });
            res.status(200).json({ message: 'Estado de la oferta actualizado exitosamente', data: updatedRequest });
        } catch (error) {
            console.error('Error al actualizar el estado de la oferta:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new OfferController();
