import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

 
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  

  return <>{children}</>;
};

export default PrivateRoute;
