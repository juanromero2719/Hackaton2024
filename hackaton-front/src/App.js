import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AOS from "aos";
import "aos/dist/aos.css";

// Importación de componentes
import Login from "./modules/login";
import Dashboard from "./modules/dashboard";
import Register from "./modules/register";
import HomePage from "./modules/homePage";
import Header from "./modules/elements/Header";
import Footer from "./modules/elements/Footer";
import ProveedorDashboard from "./modules/dashboards/ProveedorDashboard";
import AgricultorDashboard from "./modules/dashboards/AgricultorDashboard";
import CompanyDashboard from "./modules/dashboards/CompanyDashboard";
import ChatWidget from "./modules/ChatWidget";

const App = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <AppRoutes />
                </main>
                <Footer />
            </div>
        </Router>
    );
};

const AppRoutes = () => {
    const [hasSession, setHasSession] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const getCookieValue = (cookieName) => {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));
        return tokenCookie ? tokenCookie.split("=")[1] : null;
    };

    const handleLogout = useCallback(() => {
        document.cookie = "token=; Max-Age=0"; // Elimina la cookie del token
        sessionStorage.removeItem("chatHistory");
        setHasSession(false);
        navigate("/"); // Redirigir al usuario a la página principal
    }, [navigate]);

    const checkSession = useCallback(() => {
        const token = getCookieValue("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Tiempo actual en segundos
                if (decoded.exp < currentTime) {
                    console.log("Token expirado, cerrando sesión...");
                    handleLogout(); // Si el token ha expirado, cerrar sesión
                } else {
                    setHasSession(true);
                }
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                handleLogout(); // Si hay un error al decodificar, cerrar sesión
            }
        } else {
            setHasSession(false);
        }
    }, [handleLogout]);

    useEffect(() => {
        checkSession();
    }, [checkSession, location.pathname]);

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/proveedor-dashboard" element={<ProveedorDashboard />} />
                <Route path="/agricultor-dashboard" element={<AgricultorDashboard />} />
                <Route path="/company-dashboard" element={<CompanyDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            {hasSession && <ChatWidget />}
        </>
    );
};

export default App;
