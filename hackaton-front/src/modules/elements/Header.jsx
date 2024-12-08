import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import logoMetAgro from "../../logoMetAgroCiruclo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasSession, setHasSession] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Verificar sesión y obtener rol del usuario
  useEffect(() => {
    const cookieString = document.cookie; // Obtener todas las cookies
    const cookies = Object.fromEntries(
        cookieString.split("; ").map((c) => c.split("="))
    );

    const token = cookies.token; // Extraer el token
    const userInfo = cookies.userInfo
        ? JSON.parse(decodeURIComponent(cookies.userInfo))
        : null;

    setHasSession(!!token);
    if (userInfo) setUserRole(userInfo.role);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post(
          "https://hackaton-back-production.up.railway.app/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${document.cookie
                  .split("; ")
                  .find((row) => row.startsWith("token="))
                  ?.split("=")[1]}`,
            },
            withCredentials: true,
          }
      );

      document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
          "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      sessionStorage.removeItem("chatHistory");

      setHasSession(false);
      setUserRole("");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLogoClick = () => {
    if (hasSession) {
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
      }
    } else {
      navigate("/");
    }
  };

  return (
      <header
          className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200 shadow-lg"
          data-aos="fade-down"
      >
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
              src={logoMetAgro}
              alt="Logo"
              className="h-12 cursor-pointer"
              onClick={handleLogoClick}
          />
          <h1 className="text-2xl font-bold">
            <span className="text-green-600">Met</span>
            <span className="text-blue-600">Agro</span>
          </h1>
        </div>

        {/* Botones */}
        <div className="flex space-x-4">
          {hasSession ? (
              <button
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                  onClick={handleLogout}
              >
                Logout
              </button>
          ) : (
              <>
                <button
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                    onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
                    onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </>
          )}
        </div>
      </header>
  );
};

export default Header;
