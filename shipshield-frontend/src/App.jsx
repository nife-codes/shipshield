import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Scan from './Pages/Scan';
import FixPR from './Pages/FixPR';
import Issues from './Pages/Issues';
import Dashboard from './Pages/Dashboard';
import Success from './Pages/Success';

import SignIn from './components/Auth/Signin';
import SignUp from './components/Auth/Signup';

import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/success" element={<Success />} />

        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />

        /* Dashboard Routes */
        <Route element={<DashboardLayout />}>
        <Route path="/fixpr" element={<FixPR />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
