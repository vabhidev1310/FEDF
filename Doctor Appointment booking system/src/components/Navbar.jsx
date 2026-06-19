import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Stethoscope, LogOut, User, Menu, X, LayoutDashboard } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ patient: null, doctor: null });
  const [scrolled, setScrolled] = useState(false);

  const loadUser = () => {
    const patientStr = localStorage.getItem("medbook_current_patient");
    const doctorStr = localStorage.getItem("medbook_current_doctor");
    setCurrentUser({
      patient: patientStr ? JSON.parse(patientStr) : null,
      doctor: doctorStr ? JSON.parse(doctorStr) : null,
    });
  };

  useEffect(() => {
    loadUser();
    const handleAuthChange = () => loadUser();
    window.addEventListener("medbook_auth_changed", handleAuthChange);
    loadUser();
    return () => window.removeEventListener("medbook_auth_changed", handleAuthChange);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = (role) => {
    localStorage.removeItem(role === "patient" ? "medbook_current_patient" : "medbook_current_doctor");
    window.dispatchEvent(new Event("medbook_auth_changed"));
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleSmoothScroll = (elementId) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: elementId } });
    } else {
      document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Home",    action: () => navigate("/") },
    { label: "About",   action: () => handleSmoothScroll("about-section") },
    { label: "FAQ",     action: () => handleSmoothScroll("faq-section") },
    { label: "Contact", action: () => handleSmoothScroll("contact-section") },
  ];

  return (
    <motion.nav
      className={`bg-white/95 backdrop-blur-md border-b sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-indigo-100/60 shadow-lg shadow-indigo-50/50" : "border-gray-100 shadow-none"
      }`}
      id="main-navigation"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group cursor-pointer" id="navbar-logo">
              <motion.div
                className="p-2 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-xl text-white shadow-lg shadow-indigo-150"
                whileHover={{ scale: 1.12, rotate: 6 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Stethoscope className="w-5 h-5" />
              </motion.div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                Med<span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text">Book</span>
              </span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={link.action}
                className="hover-underline-grow text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors cursor-pointer bg-transparent border-none"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                whileHover={{ y: -1 }}
              >
                {link.label}
              </motion.button>
            ))}

            <span className="h-4 w-px bg-gray-200" />

            {/* Auth section */}
            <AnimatePresence mode="wait">
              {currentUser.patient ? (
                <motion.div
                  key="patient"
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotificationBell />
                  <Link to="/patient-dashboard" className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 text-sm font-medium transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-600 text-sm font-medium transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <motion.button
                    onClick={() => handleLogout("patient")}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-sm font-semibold transition-colors px-3.5 py-1.5 rounded-lg cursor-pointer"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </motion.button>
                </motion.div>
              ) : currentUser.doctor ? (
                <motion.div
                  key="doctor"
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotificationBell />
                  <Link to="/doctor-dashboard" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-bold transition-colors px-3 py-1.5 rounded-lg bg-indigo-50/80 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" /> Doctor Panel
                  </Link>
                  <motion.button
                    onClick={() => handleLogout("doctor")}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-sm font-semibold transition-colors px-3.5 py-1.5 rounded-lg cursor-pointer"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="guest"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/patient-login" className="text-gray-700 hover:text-indigo-600 text-sm font-semibold px-4 py-2 hover:bg-slate-50 rounded-lg transition-all cursor-pointer">
                      Patient Portal
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.06, y: -1 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/doctor-login" className="btn-glow text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer block">
                      Doctor Login
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center md:hidden gap-2">
            <NotificationBell />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-md overflow-hidden"
          >
            <div className="py-4 px-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  onClick={link.action}
                  className="block w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-slate-50 font-medium py-2 px-3 rounded-lg transition-colors border-none bg-transparent"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  {link.label}
                </motion.button>
              ))}

              <div className="h-px bg-gray-100 my-2" />

              {currentUser.patient ? (
                <motion.div className="space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  <div className="px-3 py-1 font-bold text-xs text-indigo-500 uppercase tracking-wider">👤 {currentUser.patient.name}</div>
                  <Link to="/patient-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 hover:bg-slate-50 font-medium py-2 px-3 rounded-lg transition-colors">Patient Dashboard</Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 hover:bg-slate-50 font-medium py-2 px-3 rounded-lg transition-colors">My Profile</Link>
                  <button onClick={() => handleLogout("patient")} className="block w-full text-left text-rose-600 hover:bg-rose-50 font-bold py-2 px-3 rounded-lg transition-colors border-none bg-transparent">Logout</button>
                </motion.div>
              ) : currentUser.doctor ? (
                <motion.div className="space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  <div className="px-3 py-1 font-bold text-xs text-indigo-500 uppercase tracking-wider">🩺 {currentUser.doctor.name}</div>
                  <Link to="/doctor-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 hover:bg-slate-50 font-semibold py-2 px-3 rounded-lg transition-colors">Doctor Panel</Link>
                  <button onClick={() => handleLogout("doctor")} className="block w-full text-left text-rose-600 hover:bg-rose-50 font-bold py-2 px-3 rounded-lg transition-colors border-none bg-transparent">Logout</button>
                </motion.div>
              ) : (
                <motion.div className="space-y-2 pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  <Link to="/patient-login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center text-gray-700 bg-slate-50 hover:bg-slate-100 font-semibold py-2.5 px-3 rounded-lg transition-colors">Patient Portal Login</Link>
                  <Link to="/doctor-login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center text-white bg-indigo-600 hover:bg-indigo-700 font-semibold py-2.5 px-3 rounded-lg transition-colors shadow-sm">Doctor Portal Login</Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
