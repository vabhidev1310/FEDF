import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ShieldAlert, CheckCircle2, Sparkles } from "lucide-react";

export default function PatientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleGuestLogin = () => {
    setError("");
    const guestEmail = "guest@medbook.com";
    const guestPassword = "password123";

    // Retrieve patients helper
    const localPatients = localStorage.getItem("medbook_patients");
    const patients = localPatients ? JSON.parse(localPatients) : [];

    // Search patient
    let found = patients.find(
      (p) => p.email.toLowerCase() === guestEmail.toLowerCase()
    );

    if (!found) {
      // Create guest patient account to seed it instantly inside database simulation
      found = {
        id: "pat-guest",
        name: "Guest Patient",
        email: guestEmail,
        password: guestPassword,
        phone: "+1 (555) 123-4567",
        gender: "Male",
        bloodGroup: "O+",
        dob: "1995-05-15",
        city: "New Delhi",
        createdAt: new Date().toISOString()
      };
      patients.push(found);
      localStorage.setItem("medbook_patients", JSON.stringify(patients));
    }

    // Set active session
    localStorage.setItem("medbook_current_patient", JSON.stringify(found));
    
    // Clear other login roles to avoid session conflicts
    localStorage.removeItem("medbook_current_doctor");

    // Trigger auth change notification event
    window.dispatchEvent(new Event("medbook_auth_changed"));

    setSuccess(true);
    setTimeout(() => {
      navigate("/patient-dashboard");
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please complete all mandatory credential inputs.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // If they typed standard guest credentials, handle it transparently with dynamic seeding
    if (trimmedEmail === "guest@medbook.com" && trimmedPassword === "password123") {
      handleGuestLogin();
      return;
    }

    // Retrieve patients
    const localPatients = localStorage.getItem("medbook_patients");
    const patients = localPatients ? JSON.parse(localPatients) : [];

    // Search patient
    const found = patients.find(
      (p) => p.email.toLowerCase() === trimmedEmail && p.password === trimmedPassword
    );

    if (!found) {
      setError("Invalid patient email or password. Please verify and try again.");
      return;
    }

    // Set active session
    localStorage.setItem("medbook_current_patient", JSON.stringify(found));
    
    // Clear other login roles to avoid session conflicts
    localStorage.removeItem("medbook_current_doctor");

    // Trigger auth update
    window.dispatchEvent(new Event("medbook_auth_changed"));

    setSuccess(true);
    setTimeout(() => {
      navigate("/patient-dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white p-6 md:p-10 rounded-3xl border border-gray-150 shadow-xl" id="patient-login-card">
        
        {/* Left Side: Standard Logins and Form */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header branding info */}
            <div>
              <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                <LogIn className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Patient Portal Login</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Access your scheduling panels and historic medical receipts.
              </p>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-700 text-xs flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success notifications */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-850 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Login authorized! Loading dashboard...</span>
              </div>
            )}

            {/* Credentials form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3.5">
                {/* Email field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-755 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-4 text-xs text-gray-955 outline-none transition-all"
                    id="patient-login-email"
                  />
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-755 uppercase tracking-wide flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-gray-400" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-4 text-xs text-gray-955 outline-none transition-all"
                    id="patient-login-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer mt-2"
                id="patient-login-submit-btn"
              >
                Authenticate Login
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-400 pt-3 border-t border-gray-100">
            Need to register?{" "}
            <Link to="/patient-register" className="font-semibold text-indigo-600 hover:underline">
              Register New Patient
            </Link>
            <span className="mx-2">|</span>
            Doctor login?{" "}
            <Link to="/doctor-login" className="font-semibold text-indigo-500 hover:underline">
              Doctor Portal →
            </Link>
          </div>
        </div>

        {/* Right Side: Quick Guest Patient Account Login */}
        <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4" id="patient-guest-section">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              Quick Guest Patient Access
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Want to experience the patient dashboard instantly without completing a full registration? Click the guest login button below to be authenticated instantly.
            </p>
          </div>

          {/* Quick Stats/Properties of Guest patient */}
          <div className="bg-white border border-gray-150 rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-gray-400 font-semibold">Guest Patient Name:</span>
              <span className="font-bold text-gray-900">Guest Patient</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-gray-400 font-semibold">Username/Email:</span>
              <span className="font-bold text-indigo-600 font-mono">guest@medbook.com</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-gray-400 font-semibold">Default Password:</span>
              <span className="font-bold text-gray-600 font-mono">password123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold">Assigned Location:</span>
              <span className="font-bold text-teal-600">New Delhi</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-3 bg-indigo-650 hover:bg-indigo-755 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
              id="patient-guest-login-btn"
            >
              <LogIn className="w-4 h-4" /> Instant Guest Login
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("guest@medbook.com");
                setPassword("password123");
                setError("");
              }}
              className="w-full py-2 bg-white hover:bg-slate-50 text-indigo-600 border border-gray-200 font-bold rounded-xl text-xs cursor-pointer text-center"
              id="patient-guest-autofill-btn"
            >
              Autofill Credentials
            </button>
          </div>
          
          <div className="text-[10px] text-gray-400 font-medium italic text-center">
            * Seeding automatic demo patient state inside Local Directory
          </div>
        </div>

      </div>
    </div>
  );
}
