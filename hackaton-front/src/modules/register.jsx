import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Iconos para mostrar/ocultar contraseñas
import backgroundImage from "../2148579758.webp"; // Ruta de la imagen de fondo

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    setLoading(true);

    const userData = { name, email, password, confirmPassword, role };

    try {
      const response = await axios.post(
          "https://hackaton-back-production.up.railway.app/auth/register",
          userData,
          { headers: { "Content-Type": "application/json" } }
      );
      console.log("Usuario registrado", response.data);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Error al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div
          className="relative w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center p-4">
          <div className="max-w-sm w-full bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
              Crear Cuenta
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa tu nombre"
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa tu correo"
                />
              </div>
              {/* Contraseña */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ingresa tu contraseña"
                  />
                  <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500"/>
                    ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500"/>
                    )}
                  </div>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirma tu contraseña"
                  />
                  <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500"/>
                    ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500"/>
                    )}
                  </div>
                </div>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="agricultor">Agricultor</option>
                  <option value="proveedor">Proveedor</option>
                  <option value="empresa turistica">Empresa Turística</option>
                </select>
              </div>
              {/* Botón de Registro */}
              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 mt-4 text-white font-semibold rounded-lg ${
                      loading
                          ? "bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700 transition"
                  }`}
              >
                {loading ? "Registrando..." : "Crear Cuenta"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;
