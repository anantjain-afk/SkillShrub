import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import RoadmapPage from './pages/RoadmapPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/generate" element={<RoadmapPage />} />
          <Route path="/roadmap/:id" element={<RoadmapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
