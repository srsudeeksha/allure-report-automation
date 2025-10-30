import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { isAuthenticated } from "./utils/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ChatWithAI from "./pages/ChatWithAI";
import FriendsPage from "./pages/FriendsPage";
import "./App.css";

const App: React.FC = () => {
  const authed = isAuthenticated();

  return (
    <Router basename="/allure-report-automation">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!authed ? <Login /> : <Navigate to="/home" replace />} />
        <Route path="/register" element={!authed ? <Register /> : <Navigate to="/home" replace />} />

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

        {/* ✅ Default Route (Fix here) */}
        <Route path="/" element={authed ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={authed ? "/home" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
