import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, User, Mail, Lock, Phone, MapPin, Calendar, HeartPulse, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function PatientRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
    bloodGroup: "O+",
    dob: "",
    city: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.dob || !formData.city) {
      setError("Please fill out all mandatory registration fields.");
      return;
    }

    // Get patients or create
    const localPatients = localStorage.getItem("medbook_patients");
    const patients = localPatients ? JSON.parse(localPatients) : [];

    // Check if email already registered
    const exists = patients.some((p) => p.email.toLowerCase() === formData.email.toLowerCase());
    if (exists) {
      setError("A patient accounts with this email address already exists. Please login instead.");
      return;
    }

    // Create patient structure
    const newPatient = {
      id: `pat-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      dob: formData.dob,
      city: formData.city,
      createdAt: new Date().toISOString()
    };

    // Storing
    patients.push(newPatient);
    localStorage.setItem("medbook_patients", JSON.stringify(patients));

    // Sign in automatically
    localStorage.setItem("medbook_current_patient", JSON.stringify(newPatient));
    
    // Clear other login role session to avoid conflicts
    localStorage.removeItem("medbook_current_doctor");

    // Notification event trigger
    window.dispatchEvent(new Event("medbook_auth_changed"));

    setSuccess(true);
    setTimeout(() => {
      navigate("/patient-dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-6 md:p-10 rounded-3xl border border-gray-150 shadow-xl">
        
        {/* Banner header title */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patient Registration</h2>
          <p className="mt-2 text-xs text-gray-500">
            Create your account to start booking clinic slots.
          </p>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-700 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success notification banner */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-emerald-800 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Registration successful! Redirecting to patient dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                id="reg-patient-name"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-gray-400" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john.doe@example.com"
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                id="reg-patient-email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-gray-400" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                id="reg-patient-password"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (555) 019-2834"
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                id="reg-patient-phone"
              />
            </div>

            {/* Gender Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-950 outline-none cursor-pointer"
                id="reg-patient-gender"
              >
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-550" /> Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-950 outline-none cursor-pointer"
                id="reg-patient-blood"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" /> Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-950 outline-none cursor-pointer"
                id="reg-patient-dob"
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" /> City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="New York"
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                id="reg-patient-city"
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl shadow-lg transition-all text-xs uppercase tracking-wide cursor-pointer mt-4"
            id="patient-register-btn"
          >
            Create Patient Account
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Already registered?{" "}
          <Link to="/patient-login" className="font-bold text-indigo-600 hover:underline">
            Login as Patient
          </Link>
        </div>

      </div>
    </div>
  );
}
