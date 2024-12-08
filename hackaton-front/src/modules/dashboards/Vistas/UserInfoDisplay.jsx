import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTractor,
    faBuilding,
    faTruck,
    faMapMarkerAlt,
    faPhone,
    faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";

const UserInfoDisplay = ({ role, data }) => {

    console.log(data);
    const renderPeasantInfo = () => (
        <div className="bg-green-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
                <FontAwesomeIcon icon={faTractor} className="mr-2" />
                Información del Agricultor
            </h2>
            <p>
                <strong>Nombre de la Finca:</strong> {data.farmName}
            </p>
            <p>
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                <strong>Contacto:</strong> {data.contact}
            </p>
            <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                <strong>Ubicación:</strong> Lat: {data.ubication.latitude}, Lng:{" "}
                {data.ubication.longitude}
            </p>
            <p>
                <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
                <strong>Productos:</strong>
            </p>
            {data.products?.length > 0 ? (
                <ul className="list-disc ml-6">
                    {data.products.map((product, index) => (
                        <li key={index}>{product.name}</li>
                    ))}
                </ul>
            ) : (
                <p>Sin productos registrados.</p>
            )}
        </div>
    );

    const renderCompanyInfo = () => (
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                Información de la Empresa Turística
            </h2>
            <p>
                <strong>Nombre de la Empresa:</strong> {data.companyName}
            </p>
            <p>
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                <strong>Contacto:</strong> {data.contact}
            </p>
            <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                <strong>Ubicación:</strong> Lat: {data.ubication.latitude}, Lng:{" "}
                {data.ubication.longitude}
            </p>
            <p>
                <strong>NIT:</strong> {data.nit}
            </p>
        </div>
    );

    const renderSupplierInfo = () => (
        <div className="bg-orange-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-orange-700 mb-4">
                <FontAwesomeIcon icon={faTruck} className="mr-2" />
                Información del Proveedor
            </h2>
            <p>
                <strong>Nombre:</strong> {data.supplierName}
            </p>
            <p>
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                <strong>Contacto:</strong> {data.contactPhone}
            </p>
            <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                <strong>Ubicación:</strong> Lat: {data.ubication.latitude}, Lng:{" "}
                {data.ubication.longitude}
            </p>
            <p>
                <strong>NIT:</strong> {data.nit}
            </p>
            <p>
                <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
                <strong>Productos Ofrecidos:</strong>
            </p>
            {data.productsOffered?.length > 0 ? (
                <ul className="list-disc ml-6">
                    {data.productsOffered.map((product, index) => (
                        <li key={index}>{product.name} - {product.quantity} unidades</li>
                    ))}
                </ul>
            ) : (
                <p>Sin productos registrados.</p>
            )}
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            {role === "agricultor" && renderPeasantInfo()}
            {role === "empresa turistica" && renderCompanyInfo()}
            {role === "proveedor" && renderSupplierInfo()}
        </div>
    );
};

export default UserInfoDisplay;
