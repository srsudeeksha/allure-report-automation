import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authed = isAuthenticated();
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
