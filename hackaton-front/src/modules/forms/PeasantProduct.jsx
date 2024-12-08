import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const PeasantProduct = ({ supplierId }) => {
  const token = document.cookie;
  const decodetoken = jwtDecode(token);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    if (!supplierId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Proveedor no encontrado.",
      });
    }
  }, [supplierId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://hackaton-back-production.up.railway.app/peasants/${supplierId}/products`,
        {
          name: formData.name,
          productionQuantity: formData.price,
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
        title: "¡Producto creado!",
        text: response.data.message || "El producto ha sido creado correctamente.",
      });
      setFormData({ name: "", price: "" }); // Limpiar el formulario
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
      <h2 className="text-2xl font-bold text-gray-800 text-center">Crear Producto</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Nombre del Producto:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Cantidad:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default PeasantProduct;
