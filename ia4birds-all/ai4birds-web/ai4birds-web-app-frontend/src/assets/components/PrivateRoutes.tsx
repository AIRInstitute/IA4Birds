import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
  const isLoggedIn = localStorage.getItem('accessToken');

  return isLoggedIn ? children : <Navigate to="/login-component" />;
};

export default PrivateRoutes;