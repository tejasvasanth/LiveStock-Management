import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Animal from "./Animal";
import Veterinarian from "./Veterinarian";
import HealthRecordPage from "./HealthRecord"; // Assuming it's the updated page
import BreedingRecord from "./BreedingRecord";
import FeedingSchedule from "./FeedingSchedule";
import ProductionPerformance from "./ProductionPerformance";
import Home from "./Home";
import { SignUpForm } from "./signup";
import { SignInForm } from "./signin";
import Navbar from "./Navbar";

// Main App component
function App() {
  // useLocation hook to get the current pathname
  const location = useLocation();
  // Determine whether to show the Navbar
  const showNavbar = !["/signup", "/signin", "/"].includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/animal" element={<Animal />} />
        <Route path="/veterinarians" element={<Veterinarian />} />
        {/* Update this route to use animalid */}
        <Route
          path="/health-records/:animalid"
          element={<HealthRecordPage />}
        />{" "}
        {/* Dynamic route */}
        <Route path="/breeding-records" element={<BreedingRecord />} />
        <Route path="/feeding-schedules" element={<FeedingSchedule />} />
        <Route
          path="/production-performances"
          element={<ProductionPerformance />}
        />
      </Routes>
    </div>
  );
}

// Wrap the App component in a Router
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
