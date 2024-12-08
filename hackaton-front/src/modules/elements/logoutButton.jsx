import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Hacer la petición al servidor para cerrar sesión
            await axios.post('https://hackaton-back-production.up.railway.app/logout', {}, {
                withCredentials: true,
            });

            // Eliminar la cookie 'session' y el historial del local storage
            Cookies.remove('session');
            sessionStorage.removeItem('chatHistory');

            // Redirigir a la página principal
            navigate('/');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
