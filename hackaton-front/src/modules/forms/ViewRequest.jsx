import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import OfferButton from "./OfferButton";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faCalendar, faTags, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export const ViewRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const token = document.cookie;
  const decodetoken = jwtDecode(token);

  useEffect(() => {
    const fetchRequests = async () => {
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

        if (Array.isArray(response.data.data)) {
          setRequests(response.data.data);
          setFilteredRequests(response.data.data);
        } else {
          setRequests([]);
          setFilteredRequests([]);
        }
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al cargar las solicitudes",
          text: "Hubo un problema al obtener las solicitudes. Inténtalo más tarde.",
        });
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  useEffect(() => {
    const applyFilters = () => {
      let filteredData = [...requests];
      if (statusFilter) {
        filteredData = filteredData.filter((request) => request.status === statusFilter);
      }
      if (requestTypeFilter) {
        filteredData = filteredData.filter((request) => request.requestType === requestTypeFilter);
      }
      if (roleFilter) {
        filteredData = filteredData.filter((request) => request.user.role === roleFilter);
      }
      setFilteredRequests(filteredData);
    };

    applyFilters();
  }, [statusFilter, requestTypeFilter, roleFilter, requests]);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") closeModal();
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin border-4 rounded-full border-t-4 border-green-500 w-16 h-16"></div>
        </div>
    );
  }

  return (
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Solicitudes Recibidas</h2>

        {/* Modern Filter Section */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
            <span className="text-gray-600 font-semibold">Filtrar por:</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Estado</option>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>

            <select
                value={requestTypeFilter}
                onChange={(e) => setRequestTypeFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tipo de Solicitud</option>
              <option value="compra">Compra</option>
              <option value="venta">Venta</option>
            </select>

            <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Rol</option>
              <option value="agricultor">Agricultor</option>
              <option value="proveedor">Proveedor</option>
              <option value="empresa turistica">Empresa Turística</option>
            </select>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
            <p className="text-center text-gray-600">No hay solicitudes disponibles.</p>
        ) : (
            <div className="space-y-6">
              {filteredRequests.map((request) => (
                  <div
                      key={request._id}
                      className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faTags} className="mr-2 text-blue-500" />
                        {request.product.name}
                      </h3>
                      <span
                          className={`text-sm font-medium px-3 py-1 rounded-lg ${
                              request.status === "activa"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                          }`}
                      >
                        {request.status}
                    </span>
                    </div>

                    {/* Detalles de la solicitud */}
                    <div className="space-y-2">
                      <p className="text-gray-600 flex items-center">
                        <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-gray-500" />
                        <strong>Tipo de Solicitud:{" "}</strong> {request.requestType}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FontAwesomeIcon icon={faTags} className="mr-2 text-gray-500" />
                        <strong>Cantidad:{" "}</strong> {request.product.quantity}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FontAwesomeIcon icon={faTags} className="mr-2 text-gray-500" />
                        <strong>Precio:{" "}</strong> ${request.product.price}
                      </p>
                    </div>

                    {/* Información del solicitante */}
                    <div className="flex justify-between items-center text-gray-600 text-sm mt-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                        <span>
                            <strong>Solicitante:{" "}</strong> {request.user.name} ({request.user.email})
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendar} className="mr-2 text-gray-500" />
                        <span>
                            <strong>Fecha de Solicitud:{" "}</strong> {new Date(request.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Botón */}
                    <div className="mt-4 text-right">
                      <button
                          onClick={() => openModal(request)}
                          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                      >
                        Hacer Oferta
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {isModalOpen && selectedRequest && (
            <div
                id="backdrop"
                className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-start pt-10 z-50"
                onClick={handleBackdropClick}
            >
              <div className="bg-white p-6 rounded-lg max-w-md w-full relative shadow-lg">
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Hacer Oferta</h3>
                <OfferButton requestId={selectedRequest._id} userId={decodetoken.id} />
              </div>
            </div>
        )}
      </div>
  );
};

export default ViewRequest;
