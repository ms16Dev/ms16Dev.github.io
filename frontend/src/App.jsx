import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from '@/core/context/ThemeContext';
import { ToastProvider } from '@/core/context/ToastContext';
import { AuthProvider } from '@/core/context/AuthContext';
import ErrorBoundary from '@/core/components/ErrorBoundary';
import ProtectedRoute from '@/core/components/ProtectedRoute';
import Layout from '@/core/components/Layout';
import Home from '@/pages/Home';
import Showcasing from '@/features/projects/pages/projects';
import Calendar from '@/features/calendar/pages/Calendar';
import Resume from '@/features/resume/pages/Resume';
import Admin from '@/features/admin/pages/Admin';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import ServerError from '@/pages/ServerError';
import { initGA, logPageView } from './analytics';

const GAListener = ({ children }) => {
  const location = useLocation();

  // Initialize GA once
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route/hash change
  useEffect(() => {
    const page = location.pathname + location.hash; // works with HashRouter
    logPageView(page);
  }, [location]);

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <GAListener>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/error" element={<ServerError />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="showcasing" element={<Showcasing />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="resume" element={<Resume />} />
                    <Route
                      path="admin"
                      element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                  {/* 404 Catch-all - must be last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </GAListener>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
