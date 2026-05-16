import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Workspace from './pages/Workspace';
import Dashboard from './pages/Dashboard';
import SharedNote from './pages/SharedNote';
import LoadingScreen from './components/ui/LoadingScreen';
import PageTransition from './components/ui/PageTransition';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <LoadingScreen />;
  return !isAuthenticated ? children : <Navigate to="/workspace" replace />;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PublicRoute><PageTransition><Login /></PageTransition></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><PageTransition><Signup /></PageTransition></PublicRoute>} />
        <Route path="/workspace" element={<ProtectedRoute><PageTransition><Workspace /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/shared/:shareId" element={<PageTransition><SharedNote /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => { init(); }, [init]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            backdropFilter: 'blur(20px)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22d3ee', secondary: '#0B1020' } },
          error:   { iconTheme: { primary: '#f472b6', secondary: '#0B1020' } },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
