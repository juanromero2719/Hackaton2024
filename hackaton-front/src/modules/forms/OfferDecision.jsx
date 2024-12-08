import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const OfferDecision = ({ offerId, requestId, onDecisionMade }) => {
    const [loading, setLoading] = useState(false);

    const handleDecision = async (status) => {
        try {
            setLoading(true);

            const token = document.cookie;
            const response = await axios.put(
                `https://hackaton-back-production.up.railway.app/offer/${requestId}/${offerId}`,
                {
                    offerId,
                    requestId,
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: `Oferta ${status === "aceptada" ? "aceptada" : "rechazada"}`,
                    text: "La decisión se ha registrado con éxito.",
                });
                onDecisionMade();
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al procesar la solicitud",
                text: "Hubo un problema al enviar tu decisión. Inténtalo más tarde.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center space-x-4">
            {/* Botón Aceptar */}
            <button
                onClick={() => handleDecision("aceptada")}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 space-x-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition disabled:opacity-50"
            >
                <FontAwesomeIcon icon={faCheck} className="text-lg" />
                <span>Aceptar</span>
            </button>

            {/* Botón Rechazar */}
            <button
                onClick={() => handleDecision("rechazada")}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 space-x-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition disabled:opacity-50"
            >
                <FontAwesomeIcon icon={faTimesCircle} className="text-lg" />
                <span>Rechazar</span>
            </button>
        </div>
    );
};

export default OfferDecision;
