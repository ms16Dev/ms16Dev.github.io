import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './features/auth/context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Showcasing from './pages/Showcasing';
import Calendar from './pages/Calendar';
import Resume from './pages/Resume';
import Admin from './pages/Admin';
import Login from './features/auth/components/Login';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

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
                  {/* 404 Catch-all - must be last */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
