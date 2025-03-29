import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLayout from "../pages/AuthLayout";
import ProtectRoute from "../components/ProtectRoute";
import Home from "../pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<AuthLayout />} />
        
        {/* Protected Route */}
        <Route 
          path="/" 
          element={
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
