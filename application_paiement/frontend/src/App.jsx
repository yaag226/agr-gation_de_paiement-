import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées - Client */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Routes protégées - Marchand */}
          <Route
            path="/merchant/dashboard"
            element={
              <ProtectedRoute allowedRoles={['merchant']}>
                <MerchantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Routes protégées - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;