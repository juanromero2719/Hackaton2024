import React from "react";
import { SunIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Para WhatsApp
import { faPhone } from '@fortawesome/free-solid-svg-icons'; // Para llamada

const Agricultores = ({ peasants, handleOpenModal }) => {
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Agricultores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {peasants.length > 0 ? (
                    peasants.map((peasant, index) => (
                        <div
                            key={peasant._id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                            data-aos="fade-up"
                            data-aos-delay={index * 100} // Retardo para escalonar la aparición
                        >
                            <div className="flex items-center mb-4">
                                <SunIcon className="h-8 w-8 text-green-600 mr-2" />
                                <h3 className="text-lg font-semibold text-green-600">{peasant.farmName}</h3>
                            </div>
                            <p>
                                <strong>Latitud:</strong> {peasant.ubication.latitude.toFixed(3)}
                            </p>
                            <p>
                                <strong>Longitud:</strong> {peasant.ubication.longitude.toFixed(3)}
                            </p>
                            <p>
                                <strong>Contacto:</strong> {peasant.contact || "No disponible"}
                            </p>
                            {peasant.address && (
                                <p>
                                    <strong>Dirección:</strong> {peasant.address}
                                </p>
                            )}
                            {peasant.products?.length > 0 && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => handleOpenModal(peasant)}
                                        className="mt-4 px-4 py-2 text-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                                    >
                                        Ver Productos
                                    </button>
                                </div>
                            )}
                            {renderContactButtons(peasant.contact)}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No se pudieron cargar los datos de agricultores.</p>
                )}
            </div>
        </div>
    );
};

export default Agricultores;
