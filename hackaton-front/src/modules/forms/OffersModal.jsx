import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import OfferDecision from "./OfferDecision";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faDollarSign, faCommentDots } from "@fortawesome/free-solid-svg-icons";

const OffersModal = ({ requestId, onClose }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = document.cookie;
        const response = await axios.get(
            `https://hackaton-back-production.up.railway.app/request/${requestId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
        );

        const requestOffers = response.data.data.offers || [];
        setOffers(requestOffers);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar las ofertas",
          text: "Hubo un problema al obtener las ofertas. Inténtalo más tarde.",
        });
        setLoading(false);
      }
    };

    if (requestId) fetchOffers();
  }, [requestId]);

  const totalPages = Math.ceil(offers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredOffers = offers.filter(
      (offer) => offer.status !== "aceptada" && offer.status !== "rechazada"
  );

  const currentOffers = filteredOffers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const refreshOffers = async () => {
    try {
      const token = document.cookie;
      const response = await axios.get(
          `https://hackaton-back-production.up.railway.app/request/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
      );
      const requestOffers = response.data.data.offers || [];
      setOffers(requestOffers);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar las ofertas",
        text: "Hubo un problema al obtener las ofertas después de la decisión. Inténtalo más tarde.",
      });
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
          <div className="spinner-border animate-spin border-4 rounded-full border-t-4 border-green-500 w-16 h-16"></div>
        </div>
    );
  }

  return (
      <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Ofertas Disponibles
            </h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          {filteredOffers.length === 0 ? (
              <p className="text-center text-gray-600">
                No hay ofertas disponibles para esta solicitud.
              </p>
          ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentOffers.map((offer) => (
                      <div
                          key={offer._id}
                          className="p-4 border rounded-md shadow-md bg-gray-50 hover:shadow-lg transition"
                      >
                        <p className="text-gray-600 flex items-center">
                          <FontAwesomeIcon
                              icon={faDollarSign}
                              className="text-green-500 mr-2"
                          />
                          <strong>Monto Ofrecido:</strong> {offer.amount}
                        </p>
                        <p className="text-gray-600 flex items-center mt-2">
                          <FontAwesomeIcon
                              icon={faDollarSign}
                              className="text-blue-500 mr-2"
                          />
                          <strong>Precio:</strong> ${offer.price}
                        </p>
                        <p className="text-gray-600 flex items-center mt-2">
                          <FontAwesomeIcon
                              icon={faCommentDots}
                              className="text-yellow-500 mr-2"
                          />
                          <strong>Comentario:</strong>{" "}
                          {offer.comment || "Sin comentario"}
                        </p>
                        <p className="mt-2 my-4">
                          <strong>Estado:</strong>{" "}
                          <span
                              className={`font-medium ${
                                  offer.status === "aceptada"
                                      ? "text-green-600"
                                      : "text-red-600"
                              }`}
                          >
                      {offer.status}
                    </span>
                        </p>

                        {/* Componente para aceptar/rechazar */}
                        <OfferDecision
                            offerId={offer._id}
                            requestId={requestId}
                            onDecisionMade={refreshOffers}
                        />
                      </div>
                  ))}
                </div>

                {/* Paginación */}
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                      <button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-4 py-2 rounded-md ${
                              currentPage === index + 1
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                          } hover:bg-blue-400 transition`}
                      >
                        {index + 1}
                      </button>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default OffersModal;
