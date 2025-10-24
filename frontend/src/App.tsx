import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

import PrivateRoute from '../PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/allure-report-automation" element={<Login />} />
        <Route path="/allure-report-automation/register" element={<Register />} />

        {/* Protected route */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
