import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MeetingsPage from './pages/meetings/MeetingsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import PaymentsPage from './pages/payments/PaymentsPage';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/meetings" 
            element={
              <PrivateRoute>
                <MeetingsPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/documents" 
            element={
              <PrivateRoute>
                <DocumentsPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/payments" 
            element={
              <PrivateRoute>
                <PaymentsPage />
              </PrivateRoute>
            } 
          />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;