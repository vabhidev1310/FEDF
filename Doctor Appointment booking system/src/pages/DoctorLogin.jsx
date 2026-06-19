import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stethoscope, Mail, Lock, ShieldAlert, CheckCircle2, Award, ClipboardCheck, Sparkles, LogIn } from "lucide-react";
import { loginDoctor, getDoctors } from "../services/doctorService";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [demoDoctors, setDemoDoctors] = useState([]);

  useEffect(() => {
    // Initialise and fetch the current doctors registered locally to display as autofill selection options
    setDemoDoctors(getDoctors().slice(0, 4)); // Let's show the first 4 for visual simplicity
  }, []);

  const handleAutofill = (doc) => {
    setEmail(doc.email);
    setPassword("password123");
    setError("");
  };

  const handleDirectDoctorLogin = () => {
    setError("");
    const firstDoc = demoDoctors[0] || { email: "sarah.taylor@medbook.com" };
    const doctorObj = loginDoctor(firstDoc.email, "password123");
    
    if (!doctorObj) {
      setError("Unable to locate and login with candidate doctor credentials.");
      return;
    }

    // Clear patient active session
    localStorage.removeItem("medbook_current_patient");

    // Trigger auth change event
    window.dispatchEvent(new Event("medbook_auth_changed"));

    setSuccess(true);
    setTimeout(() => {
      navigate("/doctor-dashboard");
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please complete all mandatory credential inputs.");
      return;
    }

    const doctor = loginDoctor(trimmedEmail, trimmedPassword);

    if (!doctor) {
      setError("Invalid doctor email address or password. (Select an autofill below or use correct password)");
      return;
    }

    // Set doctor active session
    // Clear other login roles to avoid session conflicts
    localStorage.removeItem("medbook_current_patient");

    // Trigger auth change event
    window.dispatchEvent(new Event("medbook_auth_changed"));

    setSuccess(true);
    setTimeout(() => {
      navigate("/doctor-dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white p-6 md:p-10 rounded-3xl border border-gray-150 shadow-xl">
        
        {/* Left Side: Standard Logins and Form */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header branding info */}
            <div>
              <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Doctor Portal Login</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your patient lists, update consultation fees, and approve times.
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
                <span>Doctor session authorized! Loading panel...</span>
              </div>
            )}

            {/* Credentials form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3.5">
                {/* Email field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-755 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" /> Professional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@medbook.com"
                    className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-4 text-xs text-gray-955 outline-none transition-all"
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
                    placeholder="password123"
                    className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 px-4 text-xs text-gray-955 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer"
              >
                Access Doctor Panel
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-slate-400 pt-3 border-t border-gray-100">
            For patient operations, use the{" "}
            <Link to="/patient-login" className="font-semibold text-indigo-505 hover:underline">
              Patient Portal →
            </Link>
          </div>
        </div>

        {/* Right Side: Quick Autofill Demo Accounts Selector */}
        <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4 text-indigo-600" />
              Viva Demonstration Accounts
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              To simplify your academic review, select any of the preconfigured doctor profiles below, or click the direct login button below to instantly sign in as our head cardiologist.
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleDirectDoctorLogin}
              className="w-full py-3 bg-indigo-650 hover:bg-indigo-755 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
              id="doctor-guest-login-btn"
            >
              <Sparkles className="w-4 h-4 text-amber-350 fill-amber-350" /> Instant Guest Doctor Login
            </button>
          </div>

          <div className="h-px bg-gray-200 my-1"></div>

          {/* Doctors Autofill Selector Grids */}
          <div className="space-y-2.5 overflow-y-auto max-h-56 p-1">
            {demoDoctors.map((doc) => (
              <button
                type="button"
                key={doc.id}
                onClick={() => handleAutofill(doc)}
                className="w-full bg-white hover:bg-indigo-50 border border-gray-150 rounded-xl p-3 text-left transition-all hover:scale-[1.01] hover:shadow-sm cursor-pointer flex justify-between items-center group gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-indigo-550 rounded-lg text-white font-black text-xs flex items-center justify-center shrink-0">
                    {doc.name.replace("Dr. ", "").substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {doc.name}
                    </h4>
                    <p className="text-[10px] text-indigo-500 font-semibold">{doc.specialization} specialist</p>
                  </div>
                </div>
                <div className="text-right text-[10px] space-y-0.5 shrink-0">
                  <p className="font-mono text-gray-400">click to fill</p>
                  <p className="font-semibold text-gray-500">Fee: ₹{doc.consultationFee}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="text-[10px] text-gray-400 font-medium italic text-center">
            * All passwords default to <span className="font-bold font-mono text-indigo-605 bg-white p-0.5 border border-gray-100 rounded">password123</span>
          </div>
        </div>

      </div>
    </div>
  );
}
