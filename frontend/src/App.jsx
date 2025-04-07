import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/AuthLayout";
import ProtectRoute from "./components/ProtectRoute";
import Home from "./pages/Home";
import InterviewExperienceDetail from "./components/InterviewExperienceDetail"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        
        <Route 
          path="/" 
          element={
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          } 
        />

        <Route
          path="/post/:id"
          element={
            <ProtectRoute>
              <div className="overflow-hidden md:overflow-auto">

              <InterviewExperienceDetail/>
              </div>
            </ProtectRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
