import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Agricultores from "../modules/dashboards/Vistas/Agricultor";
import Empresas from "../modules/dashboards/Vistas/Empresas";
import Proveedores from "../modules/dashboards/Vistas/Proveedor";
import ProductsDisplayPeasant from "../modules/forms/ProductsDisplayPeasant";

const Dashboard = () => {
    const [companies, setCompanies] = useState([]);
    const [peasants, setPeasants] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [error, setError] = useState("");
    const [selectedEntity, setSelectedEntity] = useState(null); // Modal Data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    useEffect(() => {
        const headers = { "Content-Type": "application/json" };

        const fetchData = async () => {
            try {
                const baseURL = "https://hackaton-back-production.up.railway.app";

                const companyResponse = await axios.get(`${baseURL}/companies`, {
                    headers,
                    withCredentials: true,
                });
                setCompanies(companyResponse.data.data);

                const peasantResponse = await axios.get(`${baseURL}/peasants`, {
                    headers,
                    withCredentials: true,
                });
                setPeasants(peasantResponse.data.data);

                const supplierResponse = await axios.get(`${baseURL}/suppliers`, {
                    headers,
                    withCredentials: true,
                });
                setSuppliers(supplierResponse.data.data);
            } catch (err) {
                setError("Error al obtener los datos: " + err.message);
            }
        };

        fetchData();
    }, [navigate]);

    const handleOpenModal = (entity) => {
        setSelectedEntity(entity);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedEntity(null);
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="space-y-12">
                {/* Agricultores */}
                <div className="p-6 rounded-lg shadow-md bg-green-100">
                    <Agricultores peasants={peasants} handleOpenModal={handleOpenModal} />
                </div>

                {/* Empresas */}
                <div className="p-6 rounded-lg shadow-md bg-blue-100">
                    <Empresas companies={companies} handleOpenModal={handleOpenModal} />
                </div>

                {/* Proveedores */}
                <div className="p-6 rounded-lg shadow-md bg-orange-100">
                    <Proveedores suppliers={suppliers} handleOpenModal={handleOpenModal} />
                </div>
            </div>

            {/* Modal de Productos */}
            {isModalOpen && selectedEntity && (
                <ProductsDisplayPeasant
                    supplier={selectedEntity}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Dashboard;
