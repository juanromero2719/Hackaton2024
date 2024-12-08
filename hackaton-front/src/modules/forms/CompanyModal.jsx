import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import UserInfoDisplay from "../dashboards/Vistas/UserInfoDisplay"; // Importar estilos de Leaflet

// Configuración del ícono predeterminado de Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export const CompanyModal = () => {

  const token = document.cookie;
  const decodedToken = jwtDecode(token); // Decodifica el token para obtener el userId
  
  const [formData, setFormData] = useState({
    companyName: "",
    nit: "",
    contact: "",
    ubication: {
      latitude: "",
      longitude: "",
    },
    userId: decodedToken.id, // Obtén el ID del usuario desde el token
  });

  const [isCompany, setIsCompany] = useState(false); // Verifica si ya es empresa
  const [companyId, setCompanyId] = useState(""); // Almacena el ID de la empresa si ya existe
  const [peasant, setPeasant] = useState({});

  useEffect(() => {
    // Verificar si el usuario ya tiene una empresa registrada
    const checkIfUserIsCompany = async () => {
      try {
        const response = await axios.get("https://hackaton-back-production.up.railway.app/companies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const existingCompany = response.data.data.find(
          (company) => company.user._id === decodedToken.id
        );

        if (existingCompany) {
          setPeasant(existingCompany);
          setIsCompany(true);
          setCompanyId(existingCompany._id); // Almacena el ID de la empresa existente
        }
      } catch (error) {
        console.error("Error al verificar empresa:", error);
      }
    };
    checkIfUserIsCompany();
  }, [token, decodedToken.id]);

  const handleUbicationChange = (coords) => {
    setFormData((prevData) => ({
      ...prevData,
      ubication: {
        latitude: coords.lat,
        longitude: coords.lng,
      },
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const LocateUser = () => {
    useMapEvents({
      click(e) {
        handleUbicationChange(e.latlng); // Actualiza las coordenadas cuando se hace clic en el mapa
      },
    });
    return null;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://hackaton-back-production.up.railway.app/company",
        {
          companyName: formData.companyName,
          nit: formData.nit,
          contact: formData.contact,
          userId: decodedToken.id,
          ubication: {
            latitude: formData.ubication.latitude,
            longitude: formData.ubication.longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "¡Empresa registrada!",
        text: response.data.message || "Los datos han sido guardados correctamente.",
      });
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: error.response.data.message || "Hubo un problema al guardar los datos.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en la conexión",
          text: "No se pudo conectar con el servidor. Por favor, inténtalo más tarde.",
        });
      }
    }
  };

  if (isCompany) {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6 mb-9">
          <UserInfoDisplay role={decodedToken.role} data={peasant}/>
        </div>
    );
  }

  return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Registro de Empresa</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Nombre de la Empresa:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">NIT:</label>
          <input
            type="text"
            name="nit"
            value={formData.nit}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Teléfono de Contacto:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {/*mapa*/}
        
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Seleccionar Ubicación:</label>
          <div className="h-72 border rounded-lg relative">
            <MapContainer
              center={[4.15302, -73.6351]} // Coordenadas iniciales
              zoom={13}
              className="absolute top-0 left-0 h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              {formData.ubication.latitude && formData.ubication.longitude && (
                <Marker
                  position={[
                    formData.ubication.latitude,
                    formData.ubication.longitude,
                  ]}
                />
              )}
              <LocateUser />
            </MapContainer>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Latitud:</label>
          <input
            type="number"
            name="latitude"
            value={formData.ubication.latitude}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Longitud:</label>
          <input
            type="number"
            name="longitude"
            value={formData.ubication.longitude}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <input type="hidden" name="userId" value={formData.userId} readOnly />

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300"
        >
          Registrar Empresa
        </button>
      </form>
    </div>
  );
};

export default CompanyModal;
