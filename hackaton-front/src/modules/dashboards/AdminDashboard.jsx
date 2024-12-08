// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://hackaton-back-production.up.railway.app/companies');
        setCompanies(response.data.data);
      } catch (err) {
        setError('Error al obtener los datos: ' + err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Lista de Empresas</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {companies.map((company) => (
          <li key={company._id} className="mb-4">
            <h3 className="text-lg font-bold">{company.companyName}</h3>
            <p><strong>NIT:</strong> {company.nit}</p>
            <p><strong>Contacto:</strong> {company.contact}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
