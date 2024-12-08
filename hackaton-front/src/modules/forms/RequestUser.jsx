import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import OffersModal from "./OffersModal";

export const UserRequests = () => {
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const token = document.cookie;
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const response = await axios.get(
          "https://hackaton-back-production.up.railway.app/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const allRequests = response.data.data;

        const filteredRequests = allRequests.filter(
          (request) => request.user._id === userId
        );

        setUserRequests(filteredRequests);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar las solicitudes",
          text: "Hubo un problema al obtener tus solicitudes. Inténtalo más tarde.",
        });
        setLoading(false);
      }
    };

    fetchUserRequests();
  }, [token, userId]);

  const openModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequestId(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin border-4 rounded-full border-t-4 border-green-500 w-16 h-16"></div>
      </div>
    );
  }

  if (userRequests.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-6">
        No tienes solicitudes registradas.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Tus Solicitudes
      </h2>

      {/* Contenedor con Flexbox */}
      <div className="flex justify-center flex-wrap gap-4">
        {userRequests.map((request) => (
          <div
            key={request._id}
            className="border border-gray-300 p-4 rounded-lg w-72"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {request.product.name}
              </h3>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-lg ${
                  request.status === "activa"
                    ? "bg-green-200 text-green-600"
                    : "bg-red-200 text-red-600"
                }`}
              >
                {request.status}
              </span>
            </div>
            <div className="mt-2 text-gray-600">
              <p>
                <strong>Tipo:</strong> {request.requestType}
              </p>
              <p>
                <strong>Cantidad:</strong> {request.product.quantity}
              </p>
              <p>
                <strong>Precio:</strong> ${request.product.price}
              </p>
            </div>
            <button
              onClick={() => openModal(request._id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full"
            >
              Ver Ofertas
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Ofertas */}
      {isModalOpen && (
        <OffersModal requestId={selectedRequestId} onClose={closeModal} />
      )}
    </div>
  );
};

export default UserRequests;
