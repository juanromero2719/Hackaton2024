import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AOS from "aos";
import "aos/dist/aos.css";
import CompanyModal from "../forms/CompanyModal";
import ProductsDisplayPeasant from "../forms/ProductsDisplayPeasant";
import { jwtDecode } from "jwt-decode";
import RequestCompany from "../forms/RequestCompany";
import ViewRequest from "../forms/ViewRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBox,
  faClipboardList,
  faEye, faFolder, faInfoCircle,
  faTimes,
  faTractor,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import Proveedores from "./Vistas/Proveedor";
import Agricultores from './Vistas/Agricultor';
import RequestUser from "../forms/RequestUser";

const ProveedorDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [peasants, setPeasants] = useState([]);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("productos");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = document.cookie;
  const decodetoken = jwtDecode(token);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const headers = { "Content-Type": "application/json" };

    const userInfoCookie = Cookies.get("token");
    if (!userInfoCookie) {
      navigate("/login");
    }

    const fetchData = async () => {
      try {
        const baseURL = "https://hackaton-back-production.up.railway.app";

        const companyResponse = await axios.get(`${baseURL}/companies`, {
          headers,
          withCredentials: true,
        });
        setCompanies(companyResponse.data.data);

        const supplierResponse = await axios.get(`${baseURL}/suppliers`, {
          headers,
          withCredentials: true,
        });
        setSuppliers(supplierResponse.data.data);

        const peasantsResponse = await axios.get(`${baseURL}/peasants`, {
          headers,
          withCredentials: true,
        });
        setPeasants(peasantsResponse.data.data);
      } catch (err) {
        setError("Error al obtener los datos: " + err.message);
      }
    };

    fetchData();
  }, [navigate]);

  const handleOpenModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuSelect = (tab) => {
    setSelectedTab(tab);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Menú de navegación */}
      <div className="relative z-50">
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 shadow-md">
          <h1 className="text-xl text-white font-bold">Empresa de turística Dashboard</h1>
          <button
            onClick={handleMenuToggle}
            className="text-white md:hidden focus:outline-none"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faTimes : faBars}
              className="h-6 w-6 transition-transform transform duration-300"
            />
          </button>
        </div>

        {/* Opciones del menú */}
        <nav
          className={`fixed inset-0 bg-black bg-opacity-50 transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:static md:bg-transparent md:translate-x-0`}
        >
          <div
            className={`bg-white w-64 h-full shadow-lg py-6 md:flex md:items-center md:justify-center md:space-x-6 md:w-auto md:h-auto md:shadow-none`}
          >
            <ul className="space-y-4 md:flex md:space-y-0 md:space-x-6 text-gray-700">
              <li
                  onClick={() => handleMenuSelect("productos")}
                  className={`cursor-pointer p-4 ${
                      selectedTab === "productos" ? "font-bold text-blue-600" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Información
              </li>
              <li
                  onClick={() => handleMenuSelect("agricultores")}
                  className={`cursor-pointer p-4 ${
                      selectedTab === "agricultores" ? "font-bold text-blue-600" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faTractor} className="mr-2"/>
                Agricultores
              </li>
              <li
                  onClick={() => handleMenuSelect("proveedores")}
                  className={`cursor-pointer p-4 ${
                      selectedTab === "proveedores" ? "font-bold text-blue-600" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faTruck} className="mr-2"/>
                Proveedores
              </li>
              <li
                  onClick={() => handleMenuSelect("solicitud")}
                  className={`cursor-pointer p-4 ${
                      selectedTab === "solicitud" ? "font-bold text-blue-600" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2"/>
                Crear Solicitud
              </li>
              <li
                  onClick={() => handleMenuSelect("showsol")}
                  className={`cursor-pointer p-4 ${
                      selectedTab === "showsol" ? "font-bold text-blue-600" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faEye} className="mr-2"/>
                Ver Solicitudes
              </li>
              <li
                  onClick={() => handleMenuSelect("minesol")}
                  className={`cursor-pointer p-4 ${
                      selectedTab === "minesol" ? "font-bold text-blue-600" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faFolder} className="mr-2"/>
                Mis Solicitudes
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {selectedTab === "productos" && (
            <div data-aos="fade-left" className="mb-12">
              <CompanyModal/>
            </div>
        )}

        {selectedTab === 'agricultores' && <Agricultores peasants={peasants} handleOpenModal={handleOpenModal} />}
        {selectedTab === "proveedores" && <Proveedores suppliers={suppliers} handleOpenModal={handleOpenModal} />}

        {selectedTab === "solicitud" && <RequestCompany supplierId={decodetoken.id} />}
        {selectedTab === "showsol" && <ViewRequest />}
        {selectedTab === "minesol" && <RequestUser />}
      </div>

      {/* Modal de productos */}
      {selectedSupplier && (
        <ProductsDisplayPeasant
          supplier={selectedSupplier}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProveedorDashboard;

