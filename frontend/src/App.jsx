import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './features/auth/context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Showcasing from './pages/Showcasing';
import Calendar from './pages/Calendar';
import Resume from './pages/Resume';
import Admin from './pages/Admin';
import Login from './features/auth/components/Login';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
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
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
