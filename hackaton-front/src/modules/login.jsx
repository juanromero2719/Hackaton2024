import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importar iconos de Heroicons
import backgroundImage from "../2148579758.webp";

const Login = () => {
  const entorno = "https://hackaton-back-production.up.railway.app/auth/login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
          entorno,
          { email, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: "include",
          }
      );

      if (response.data && response.data.userInfo) {
        const userRole = response.data.userInfo.role;

        Cookies.set("token", response.data.token);
        Cookies.set("userInfo", JSON.stringify(response.data.userInfo));

        switch (userRole) {
          case "administrador":
            navigate("/dashboard");
            break;
          case "agricultor":
            navigate("/agricultor-dashboard");
            break;
          case "proveedor":
            navigate("/proveedor-dashboard");
            break;
          case "empresa turistica":
            navigate("/company-dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        setError("No se pudo obtener el rol del usuario.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión.");
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
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg shadow-lg z-10">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
              Iniciar Sesión
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 mt-4 text-white font-semibold rounded-lg ${
                      loading
                          ? "bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700 transition"
                  }`}
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <a
                    href="/register"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                Regístrate
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;