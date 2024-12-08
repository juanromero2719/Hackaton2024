import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar para redirección
import Cookies from "js-cookie"; // Importa js-cookie

const Companias = () => {
  const [companias, setCompanias] = useState([]);  // Estado para almacenar las compañías
  const [loading, setLoading] = useState(true);  // Estado para controlar la carga
  const [error, setError] = useState(null);  // Estado para errores
  const navigate = useNavigate();  // Hook para redirigir en caso de error de autenticación

  // Verificar si el token existe y si está expirado
  const isAuthenticated = () => {
    const session = Cookies.get('session');
     // Obtener la sesión completa desde las cookies
    if (!session) return false; // Si no existe la sesión, el usuario no está autenticado

    try {
      const sessionData = JSON.parse(session); // Parsear la sesión almacenada
      const token = sessionData.token; // Obtener el token de la sesión
      return !!token; // Verificar si hay un token
    } catch (error) {
      return false; // Si hubo un error al parsear la sesión, no está autenticado
    }
  };

  useEffect(() => {
    console.log('Sesión:', session);
    // Redirigir al login si no está autenticado
    if (!isAuthenticated()) {
      navigate("/login"); // Redirigir a la página de login si no está autenticado
      return; // Salir de la función
    }

    // Función para obtener las compañías desde el backend
    const fetchCompanias = async () => {
      const session = Cookies.get('session'); // Obtener la sesión completa desde las cookies
    
      if (!session) {
        setError("No se encontró sesión válida");
        return;
      }
    
      const sessionData = JSON.parse(session); // Parsear la sesión
      const token = sessionData.token; // Obtener el token de la sesión
    
      try {
        const response = await axios.get('https://hackaton-back-production.up.railway.app/companies', {
          headers: {
            'Authorization': `Bearer ${token}`, // Enviar el token en el header Authorization
          },
          withCredentials: true, // Asegúrate de enviar las cookies si es necesario
        });
    
        setCompanias(response.data); // Establecer las compañías en el estado
      } catch (err) {
        setError(err.message); // Si hay un error, guardar el mensaje en el estado
      } finally {
        setLoading(false); // Cuando termine la solicitud, marcar como carga completa
      }
    };

    fetchCompanias();  // Llamar a la función al cargar el componente
  }, [navigate]);  // Dependencia en navigate para redirigir

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800">Compañías</h3>
      <p className="text-gray-600">Administra las compañías de tu red. Aquí puedes ver los detalles, agregar o editar.</p>
      
      {companias.length > 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <ul>
            {companias.map((compania) => (
              <li key={compania.id} className="mb-4">
                <h4 className="text-xl font-semibold text-gray-700">{compania.name}</h4>
                <p className="text-gray-500">{compania.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No hay compañías disponibles.</p>
      )}
    </div>
  );
};

export default Companias;
