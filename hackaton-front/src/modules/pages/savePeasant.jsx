import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Swal from "sweetalert2";
import axios from "axios";
import "leaflet/dist/leaflet.css"; // Asegúrate de incluir los estilos de Leaflet
import { jwtDecode } from "jwt-decode";
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

export const RegistrationForm = () => {
  const token = document.cookie;
  const decodetoken= jwtDecode(token);
  const [formData, setFormData] = useState({
    farmName: "",
    products: [],
    ubication: {
      latitude: "",
      longitude: "",
    },
    userId: decodetoken.id,
  });

  const farmName = formData.farmName;
  const latitude = formData.ubication.latitude;
  const longitude = formData.ubication.longitude;
  const userId = formData.userId;
  
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
        handleUbicationChange(e.latlng); // Actualiza la latitud y longitud al hacer clic
      },
    });
    return null;
  };

  const url = "https://hackaton-back-production.up.railway.app/save/peasant";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        url,
        {
          ubication: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
          farmName: farmName,
          products: [],
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
          withCredentials: true, // Asegúrate de enviar cookies si es necesario
        }
      );

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Registro de Campesino</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Nombre de la finca:</label>
          <input
            type="text"
            name="farmName"
            value={formData.farmName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Seleccionar ubicación:</label>
          <div className="map-container h-72 border rounded-lg relative">
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
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
