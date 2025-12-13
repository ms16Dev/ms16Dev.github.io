import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/error" element={<ServerError />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="showcasing" element={<Showcasing />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="resume" element={<Resume />} />
                  <Route path="admin" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                </Route>
                {/* 404 Catch-all - must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
