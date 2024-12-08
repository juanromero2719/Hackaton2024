import React from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"; // Para WhatsApp
import { faPhone } from "@fortawesome/free-solid-svg-icons"; // Para llamada

const Proveedores = ({ suppliers, handleOpenModal }) => {
    const normalizeContact = (contact) => {
        if (!contact) return null;
        const sanitized = contact.replace(/\D+/g, ""); // Quitar todo lo que no sea número
        return sanitized.startsWith("57") ? sanitized : `57${sanitized}`; // Agregar prefijo si falta
    };

    const isValidCellNumber = (contact) => {
        const cellRegex = /^57\d{10}$/; // Validar que comience con 57 y tenga 10 dígitos después
        return cellRegex.test(contact);
    };

    const renderContactButtons = (contact) => {
        const normalizedContact = normalizeContact(contact);
        if (!normalizedContact) return null;

        const isCell = isValidCellNumber(normalizedContact);

        return (
            <div className="flex justify-center space-x-4 mt-4">
                {isCell && (
                    <a
                        href={`https://wa.me/${normalizedContact}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                        <span>WhatsApp</span>
                    </a>
                )}
                <a
                    href={`tel:${normalizedContact}`}
                    className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                    <FontAwesomeIcon icon={faPhone} className="text-lg" />
                    <span>Llamar</span>
                </a>
            </div>
        );
    };

    return (
        <div data-aos="fade-left">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Proveedores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.length > 0 ? (
                    suppliers.map((supplier, index) => (
                        <div
                            key={supplier._id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                            data-aos="fade-up"
                            data-aos-delay={index * 100} // Retardo para escalonar la aparición
                        >
                            <div className="flex items-center mb-4">
                                <ShoppingBagIcon className="h-8 w-8 text-orange-600 mr-2" />
                                <h3 className="text-lg font-semibold text-orange-600">{supplier.supplierName}</h3>
                            </div>
                            <p>
                                <strong>NIT:</strong> {supplier.nit}
                            </p>
                            <p>
                                <strong>Teléfono:</strong> {supplier.contactPhone || "No disponible"}
                            </p>
                            <p>
                                <strong>Dirección:</strong> {supplier.address || "No disponible"}
                            </p>
                            <p>
                                <strong>Transportes Disponibles:</strong>{" "}
                                {supplier.transportAvailability ? "Sí" : "No"}
                            </p>
                            <h5 className="font-semibold mt-3">Áreas de Cobertura</h5>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {supplier.coverageAreas?.length > 0 ? (
                                    supplier.coverageAreas.map((area, index) => (
                                        <li key={index}>{area}</li>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Sin áreas registradas.</p>
                                )}
                            </ul>
                            {supplier.productsOffered?.length > 0 && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => handleOpenModal(supplier)}
                                        className="mt-4 px-4 py-2 text-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                                    >
                                        Ver Productos
                                    </button>
                                </div>
                            )}
                            {renderContactButtons(supplier.contactPhone)}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No se pudieron cargar los datos de proveedores.</p>
                )}
            </div>
        </div>
    );
};

export default Proveedores;
