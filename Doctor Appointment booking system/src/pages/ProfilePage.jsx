import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, HeartPulse, MapPin, DollarSign, Award, ClipboardEdit, CheckCircle2, ShieldAlert } from "lucide-react";
import { getDoctorById, updateDoctorProfile } from "../services/doctorService";

export default function ProfilePage() {
  const [role, setRole] = useState("");
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  
  const [patientForm, setPatientForm] = useState({ name: "", phone: "", gender: "Male", bloodGroup: "O+", dob: "", city: "" });
  const [doctorForm, setDoctorForm] = useState({ name: "", phone: "", consultationFee: 500, availableDays: [], availableTime: "", bio: "", city: "" });
  
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other"];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const loadProfile = () => {
    const patientStr = localStorage.getItem("medbook_current_patient");
    const doctorStr = localStorage.getItem("medbook_current_doctor");

    if (patientStr) {
      setRole("patient");
      const pData = JSON.parse(patientStr);
      setPatient(pData);
      setPatientForm({
        name: pData.name || "",
        phone: pData.phone || "",
        gender: pData.gender || "Male",
        bloodGroup: pData.bloodGroup || "O+",
        dob: pData.dob || "",
        city: pData.city || ""
      });
    } else if (doctorStr) {
      setRole("doctor");
      const dData = JSON.parse(doctorStr);
      
      // Fetch fresh details from main DB in case of updates
      const freshDoc = getDoctorById(dData.id) || dData;
      setDoctor(freshDoc);
      setDoctorForm({
        name: freshDoc.name || "",
        phone: freshDoc.phone || "",
        consultationFee: freshDoc.consultationFee || 500,
        availableDays: freshDoc.availableDays || [],
        availableTime: freshDoc.availableTime || "",
        bio: freshDoc.bio || "",
        city: freshDoc.city || ""
      });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!patientForm.name || !patientForm.phone || !patientForm.dob || !patientForm.city) {
      setError("Please complete all mandatory fields.");
      return;
    }

    const localPatients = localStorage.getItem("medbook_patients");
    if (!localPatients) return;

    const patients = JSON.parse(localPatients);
    const updated = patients.map((pat) => {
      if (pat.id === patient.id) {
        return { ...pat, ...patientForm };
      }
      return pat;
    });

    const refreshedPatient = { ...patient, ...patientForm };

    localStorage.setItem("medbook_patients", JSON.stringify(updated));
    localStorage.setItem("medbook_current_patient", JSON.stringify(refreshedPatient));

    setPatient(refreshedPatient);
    setSuccess("Your patient personal profile has been updated successfully!");
    
    // Trigger header updates
    window.dispatchEvent(new Event("medbook_auth_changed"));
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!doctorForm.name || !doctorForm.availableTime || !doctorForm.bio || !doctorForm.city) {
      setError("Please complete all mandatory fields.");
      return;
    }

    if (doctorForm.availableDays.length === 0) {
      setError("Please select at least 1 shift weekday.");
      return;
    }

    // Call service to update
    const isOk = updateDoctorProfile(doctor.id, {
      name: doctorForm.name,
      phone: doctorForm.phone,
      consultationFee: parseInt(doctorForm.consultationFee, 10),
      availableDays: doctorForm.availableDays,
      availableTime: doctorForm.availableTime,
      bio: doctorForm.bio,
      city: doctorForm.city
    });

    if (isOk) {
      setSuccess("Your medical profile & availability metrics updated successfully!");
      // reload fresh
      loadProfile();
      window.dispatchEvent(new Event("medbook_auth_changed"));
    } else {
      setError("An error occurred during profiling. Please try again.");
    }
  };

  const toggleDay = (day) => {
    setDoctorForm((prev) => {
      const days = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: days };
    });
  };

  if (!role) {
    return (
      <div className="py-24 text-center text-gray-500">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold">Access Denied</h3>
        <p className="text-xs text-gray-400 mt-1">Please login to retrieve and manage your clinical configurations.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Module title card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-650 rounded-xl">
              <ClipboardEdit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Manage Account Profile</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Update credentials, schedules, and medical parameters in real time.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-[10px] uppercase tracking-wide">
            {role} Role
          </span>
        </div>

        {/* Success / Error indications */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-xs flex items-center gap-3 animate-slide-up">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs flex items-center gap-3 animate-slide-up">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {role === "patient" && patient && (
          /* PATIENT PROFILE FORM */
          <form onSubmit={handlePatientSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-150 shadow-lg space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 text-base flex items-center gap-1.5">
              <User className="w-5 h-5 text-indigo-500" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={patientForm.name}
                  onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                />
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1 opacity-80">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> Email (Permanent)
                </label>
                <input
                  type="email"
                  disabled
                  value={patient.email}
                  className="w-full bg-slate-100 border border-gray-200 rounded-xl py-3 px-4 text-xs text-gray-500 outline-none cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-405" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                />
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-405" /> Date of Birth
                </label>
                <input
                  type="date"
                  value={patientForm.dob}
                  onChange={(e) => setPatientForm({ ...patientForm, dob: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-950 outline-none cursor-pointer"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Gender</label>
                <select
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-950 outline-none cursor-pointer"
                >
                  {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Blood group */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-550" /> Blood Group
                </label>
                <select
                  value={patientForm.bloodGroup}
                  onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-950 outline-none cursor-pointer"
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-405" /> City / Location
                </label>
                <input
                  type="text"
                  value={patientForm.city}
                  onChange={(e) => setPatientForm({ ...patientForm, city: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl shadow-md text-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {role === "doctor" && doctor && (
          /* DOCTOR PROFILE FORM */
          <form onSubmit={handleDoctorSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-150 shadow-lg space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5 animate-slide-up">
                <Award className="w-5 h-5 text-indigo-500" /> Professional Profiles
              </h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {doctor.specialization} specialist
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Doctor Full Name</label>
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                />
              </div>

              {/* Professional Email (Readonly) */}
              <div className="space-y-1 opacity-80">
                <label className="text-xs font-bold text-gray-655 uppercase tracking-wide">Permanent Email</label>
                <input
                  type="email"
                  disabled
                  value={doctor.email}
                  className="w-full bg-slate-100 border border-gray-200 rounded-xl py-3 px-4 text-xs text-gray-500 outline-none cursor-not-allowed"
                />
              </div>

              {/* Consultation Fee */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-indigo-500" /> Consultation Fee (₹)
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={doctorForm.consultationFee}
                  onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                />
              </div>

              {/* Clinic hours */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Shifts Hours Range</label>
                <input
                  type="text"
                  value={doctorForm.availableTime}
                  onChange={(e) => setDoctorForm({ ...doctorForm, availableTime: e.target.value })}
                  placeholder="e.g. 09:00 AM - 01:00 PM"
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Clinic City / Location</label>
                <input
                  type="text"
                  value={doctorForm.city}
                  onChange={(e) => setDoctorForm({ ...doctorForm, city: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Clinic Contact Phone</label>
                <input
                  type="text"
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all"
                />
              </div>
            </div>

            {/* Shift Weekday toggles */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                Scheduled Clinic Days
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const isChecked = doctorForm.availableDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? "bg-indigo-650 text-white border-indigo-650 shadow-md transform scale-[1.03]"
                          : "bg-white text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 border-gray-200"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clinical Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Clinical Biography</label>
              <textarea
                rows="4"
                value={doctorForm.bio}
                onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
                required
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl shadow-md text-xs cursor-pointer"
              >
                Save Clinic Configuration
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
