import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAuthData({ token, user: decodedToken });
      } catch (err) {
        setError('Token inválido o expirado');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthData(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authData, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
