

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Scan from './Pages/Scan';
import FixPR from './Pages/FixPR';
import Issues from './Pages/Issues';
import Dashboard from './Pages/Dashboard';
import Success from './Pages/Success';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/fixpr" element={<FixPR />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
