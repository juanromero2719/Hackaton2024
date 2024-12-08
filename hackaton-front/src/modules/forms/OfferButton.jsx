import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faBox, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const OfferButton = ({ requestId, userId }) => {
    const [amount, setAmount] = useState(""); // Estado para cantidad
    const [price, setPrice] = useState(""); // Estado para precio
    const token = document.cookie; // Obtener token desde las cookies

    // Función para manejar el envío de la oferta
    const handleOffer = async () => {
        const parsedAmount = Number(amount);
        const parsedPrice = Number(price);

        if (!parsedAmount || !parsedPrice) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos o inválidos",
                text: "Por favor, ingrese valores válidos para la cantidad y el precio.",
            });
            return;
        }

        const offerData = {
            requestId,
            userId,
            amount: parsedAmount,
            price: parsedPrice,
        };

        try {
            const response = await axios.post(
                "https://hackaton-back-production.up.railway.app/offer",
                offerData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (!response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Oferta enviada",
                    text: "Tu oferta se ha enviado correctamente.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al enviar la oferta",
                    text: "Hubo un problema al enviar la oferta. Inténtalo nuevamente.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al enviar la oferta",
                text: "Hubo un problema al enviar la oferta. Inténtalo más tarde.",
            });
        }
    };

    return (
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-700 text-center">Hacer una Oferta</h3>

            {/* Input para la cantidad */}
            <div className="relative">
                <label className="text-gray-600 mb-1 block">Cantidad</label>
                <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
                    <FontAwesomeIcon icon={faBox} className="text-gray-500 mx-2" />
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border-none focus:outline-none"
                        placeholder="Ingrese la cantidad"
                    />
                </div>
            </div>

            {/* Input para el precio */}
            <div className="relative">
                <label className="text-gray-600 mb-1 block">Precio</label>
                <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
                    <FontAwesomeIcon icon={faDollarSign} className="text-gray-500 mx-2" />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border-none focus:outline-none"
                        placeholder="Ingrese el precio"
                    />
                </div>
            </div>

            {/* Botón para enviar la oferta */}
            <button
                onClick={handleOffer}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-300"
            >
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Enviar Oferta
            </button>
        </div>
    );
};

export default OfferButton;
