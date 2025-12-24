import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import ClientPayment from './pages/ClientPayment';
import ClientDashboard from './pages/ClientDashboard';
import AggregatedPayment from './pages/AggregatedPayment';
import AggregationHistory from './pages/AggregationHistory';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Page d'accueil publique */}
      <Route path="/" element={<Home />} />

      {/* Routes publiques d'authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Routes publiques pour les clients */}
      <Route path="/client/payer" element={<ClientPayment />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
      <Route path="/client/aggregation" element={<AggregatedPayment />} />
      <Route path="/client/aggregation/history" element={<AggregationHistory />} />

      {/* Routes privées pour les marchands */}
      <Route
        path="/merchant"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
