import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import DoctorLogin from "./pages/DoctorLogin";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import BookAppointment from "./pages/BookAppointment";
import ProfilePage from "./pages/ProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { getDoctors } from "./services/doctorService";
import SplashScreen from "./components/SplashScreen";

// Helper component to scroll page to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    // Initialise default doctor records in local storage
    getDoctors();
  }, []);

  return (
    <Router>
      <ScrollToTop />

      {/* Splash intro animation overlay */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      <div className={`flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-gray-800 ${!showSplash ? "page-revealed" : "opacity-0"}`} id="medbook-app-wrapper">
        {/* Navigation bar header */}
        <Navbar />

        {/* Core Main Views wrapper */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/patient-register" element={<PatientRegister />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            
            {/* Protected routes */}
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute role="patient">
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            {/* Default fallback route -> home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
