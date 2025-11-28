import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Showcasing from './pages/Showcasing';
import Calendar from './pages/Calendar';
import Resume from './pages/Resume';
import Admin from './pages/Admin';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="showcasing" element={<Showcasing />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="resume" element={<Resume />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
