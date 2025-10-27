// App.tsx
// Main application component with routing configuration

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ChatWithAI from './pages/ChatWithAI';
import FriendsPage from './pages/FriendsPage';
import './App.css';

/**
 * Main App component
 * Configures routing for the entire application
 */
const App: React.FC = () => {
  return (
    <Router basename="/allure-report-automation">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatWithAI />
            </PrivateRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <PrivateRoute>
              <FriendsPage />
            </PrivateRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;