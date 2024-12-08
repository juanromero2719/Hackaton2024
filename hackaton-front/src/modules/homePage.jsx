import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faHandshake,
  faPiggyBank,
  faUsers,
  faComments,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 px-6 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Título Principal */}
          <section className="text-center mb-12" data-aos="fade-up">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
              Bienvenido a{" "}
              <span className="text-green-600">Met</span>
              <span className="text-blue-600">Agro</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              La plataforma digital que une el mundo agrícola, agropecuario y turístico en el corazón del Meta.
              Diseñada para <strong>impulsar la economía local y fortalecer la colaboración</strong> entre agricultores,
              empresas turísticas y proveedores de insumos.
            </p>
          </section>

          {/* Sección: Beneficios */}
          <section className="mb-12" data-aos="fade-right">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
              Beneficios de MetAgro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Beneficio 1 */}
              <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="bg-green-500 text-white p-4 rounded-full mb-4">
                  <FontAwesomeIcon icon={faHandshake} className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Conexiones Estratégicas
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Vincula agricultores y proveedores con empresas turísticas y nuevos mercados,
                  creando oportunidades de negocio únicas.
                </p>
              </div>

              {/* Beneficio 2 */}
              <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="bg-green-500 text-white p-4 rounded-full mb-4">
                  <FontAwesomeIcon icon={faSeedling} className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Sostenibilidad
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Promueve el comercio justo y fomenta prácticas responsables para proteger
                  el medio ambiente y el patrimonio cultural.
                </p>
              </div>

              {/* Beneficio 3 */}
              <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="bg-green-500 text-white p-4 rounded-full mb-4">
                  <FontAwesomeIcon icon={faPiggyBank} className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Optimización de Recursos
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Ahorra tiempo y dinero conectando directamente con actores confiables en tu cadena de suministro.
                </p>
              </div>
            </div>
          </section>

          {/* Sección: Testimonios */}
          <section className="mb-12" data-aos="zoom-in">
            <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
              Historias de Éxito
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonio 1 */}
              <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="bg-blue-500 text-white p-4 rounded-full mb-4">
                  <FontAwesomeIcon icon={faUsers} className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Juan Pérez
                </h3>
                <p className="italic text-gray-600 text-center leading-relaxed">
                  "Gracias a MetAgro, he conseguido proveedores confiables para mis cultivos, lo que ha incrementado mis ingresos significativamente."
                </p>
              </div>

              {/* Testimonio 2 */}
              <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="bg-blue-500 text-white p-4 rounded-full mb-4">
                  <FontAwesomeIcon icon={faChartLine} className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Ana López
                </h3>
                <p className="italic text-gray-600 text-center leading-relaxed">
                  "La facilidad para encontrar productos y el soporte del asistente virtual me han ahorrado tiempo y esfuerzo."
                </p>
              </div>

              {/* Testimonio 3 */}
              <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="bg-blue-500 text-white p-4 rounded-full mb-4">
                  <FontAwesomeIcon icon={faComments} className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Carlos Ramírez
                </h3>
                <p className="italic text-gray-600 text-center leading-relaxed">
                  "La conexión con otros agricultores ha sido excelente, fortaleciendo nuestra capacidad para negociar colectivamente."
                </p>
              </div>
            </div>
          </section>

          {/* Sección: Llamado a la Acción */}
          <section className="text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              ¿Listo para unirte?
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed">
              Regístrate hoy y forma parte de la comunidad que está revolucionando la economía
              agrícola y agropecuaria del Meta.
            </p>
            <button
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
                onClick={() => window.location.href = "/register"}
            >
              Regístrate ahora
            </button>
          </section>
        </main>
      </div>
  );
};

export default HomePage;
