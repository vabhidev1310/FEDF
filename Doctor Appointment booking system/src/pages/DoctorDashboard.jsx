import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign, 
  Calendar, FileText, BadgeAlert, Sparkles, UserCheck, ShieldCheck, ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import { getDoctorById, updateDoctorProfile } from "../services/doctorService";
import { getAppointmentsByDoctor, updateAppointmentStatus } from "../services/appointmentService";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  
  // Editor inline states
  const [editingFee, setEditingFee] = useState(false);
  const [consultationFeeInput, setConsultationFeeInput] = useState(0);
  const [profileSuccess, setProfileSuccess] = useState("");

  const loadDoctorData = () => {
    const docStr = localStorage.getItem("medbook_current_doctor");
    if (!docStr) {
      navigate("/doctor-login");
      return;
    }
    const parsedDoctor = JSON.parse(docStr);
    
    // Fetch fresh profile from DB in case of edits
    const freshProfile = getDoctorById(parsedDoctor.id) || parsedDoctor;
    setDoctor(freshProfile);
    setConsultationFeeInput(freshProfile.consultationFee || 500);

    // Fetch appointments specifically assigned to this doctor
    const apps = getAppointmentsByDoctor(freshProfile.id);
    setAppointments(apps);
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  const handleStatusChange = (apptId, specStatus) => {
    const updated = updateAppointmentStatus(apptId, specStatus);
    if (updated) {
      loadDoctorData(); // Refresh metrics and lists
    }
  };

  const handleUpdateFee = (e) => {
    e.preventDefault();
    if (!doctor) return;
    setProfileSuccess("");

    const parsedFee = parseInt(consultationFeeInput, 10);
    if (!parsedFee || parsedFee <= 0) {
      alert("Please specify a valid consultation fee amount.");
      return;
    }

    const ok = updateDoctorProfile(doctor.id, { consultationFee: parsedFee });
    if (ok) {
      setProfileSuccess("Consultation fee updated successfully!");
      setEditingFee(false);
      loadDoctorData(); // refresh

      setTimeout(() => {
        setProfileSuccess("");
      }, 3500);
    }
  };

  // Compute metrics
  const totalSlots = 8; // Available slots as standard capacity simulation
  const stats = {
    pending: appointments.filter((a) => a.status === "Pending").length,
    confirmed: appointments.filter((a) => a.status === "Confirmed").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length,
    rejected: appointments.filter((a) => a.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 animate-fade-in" id="doctor-dashboard-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Banner */}
        {doctor && (
          <div className="bg-gradient-to-r from-teal-650 via-teal-600 to-indigo-650 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-350" /> Clinical Practitioner Portal
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {doctor.name}</h1>
              <p className="text-sm text-teal-50/90 max-w-sm">
                Primary Specialty Profile: <strong>{doctor.specialization} Practitioner</strong>
              </p>
            </div>
            {/* Quick Profile Summary */}
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-md space-y-1 text-xs shrink-0 font-medium">
              <p>📍 Location: {doctor.city || "Branch Clinic"}</p>
              <p>🕒 Clinic Shifts: {doctor.availableTime}</p>
              <p>📅 Days Worked: {doctor.availableDays.join(", ")}</p>
            </div>
          </div>
        )}

        {/* Doctor Stats Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="doctor-stats-grid">
          {[
            { label: "Pending Requests", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
            { label: "Confirmed Slots", value: stats.confirmed, icon: CheckCircle2, color: "text-emerald-505 bg-emerald-50 border-emerald-110" },
            { label: "Cancelled By Patient", value: stats.cancelled, icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-100" },
            { label: "Simulated Shift Slots", value: totalSlots, icon: Calendar, color: "text-blue-600 bg-blue-50 border-blue-105" },
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-5 rounded-2xl border ${stat.color} shadow-sm flex items-center gap-4`}>
              <div className="p-3.5 rounded-xl shrink-0">
                <stat.icon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs font-bold text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Success Alert Banner for inline saves */}
        {profileSuccess && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-slide-up">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {/* Quick Config Row (Update Consultation fee & Modify Profile redirection) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Quick Fee Control Panel */}
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-indigo-500 fill-current" />
                Clinic Fee Structure
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Edit your standard charged consult fee visible on patient cards.
              </p>
            </div>

            {editingFee ? (
              <form onSubmit={handleUpdateFee} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={consultationFeeInput}
                    onChange={(e) => setConsultationFeeInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2 px-3 text-xs outline-none transition-all font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-750 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFee(false);
                      setConsultationFeeInput(doctor.consultationFee);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-550">Current fee:</span>
                  <p className="text-2xl font-black text-gray-950 mt-1">₹{doctor?.consultationFee || 500}</p>
                </div>
                <button
                  onClick={() => setEditingFee(true)}
                  className="px-4 py-2 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Change Fee
                </button>
              </div>
            )}
          </div>

          {/* Quick Profile Nav Links */}
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Shift Scheduling & Availability
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Configure your shift hours, clinical days, and biographic summary.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-450 leading-relaxed font-medium">To modify click days or details, head inside the profile.</span>
              <button
                onClick={() => navigate("/profile")}
                className="bg-teal-600 hover:bg-teal-750 text-white px-4.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0 ml-4 group"
              >
                Modify Slots
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* main Appointents Area */}
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-gray-150">
            <h2 className="text-xl font-bold text-gray-900">Patient Appointments Assigned to You</h2>
            <span className="text-xs text-gray-400">Total requests logs: {appointments.length}</span>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white border border-gray-150 rounded-2xl py-12 px-4 text-center space-y-3">
              <BadgeAlert className="w-12 h-12 text-gray-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-gray-950">No Patient Appointments</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  There are currently no active appointment requests scheduled for your specialization.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-150 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs align-middle divide-y divide-gray-100" id="appointments-status-table">
                  <thead className="bg-slate-50 text-gray-455 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Appt ID</th>
                      <th className="p-4">Patient Name</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Slot</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {appointments.slice().reverse().map((appt) => {
                      
                      // Status Badge coloring
                      let badge = "bg-amber-50 text-amber-700 border-amber-100";
                      if (appt.status === "Confirmed") badge = "bg-emerald-50 text-emerald-700 border-emerald-100";
                      if (appt.status === "Rejected") badge = "bg-rose-50 text-rose-700 border-rose-100";
                      if (appt.status === "Cancelled") badge = "bg-slate-100 text-slate-500 border-slate-205";

                      return (
                        <motion.tr
                          key={appt.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-4 font-mono font-bold text-indigo-600">{appt.id}</td>
                          <td className="p-4 font-bold text-gray-900">{appt.patientName}</td>
                          <td className="p-4 text-gray-500">{appt.patientPhone || "+1 (555) 000-0000"}</td>
                          <td className="p-4 whitespace-nowrap">{appt.date}</td>
                          <td className="p-4 whitespace-nowrap">{appt.timeSlot}</td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black uppercase ${badge}`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            {appt.status === "Pending" ? (
                              <div className="flex justify-end gap-1.5 font-bold">
                                <button
                                  onClick={() => handleStatusChange(appt.id, "Confirmed")}
                                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-150 rounded-lg text-[11px] transition-all cursor-pointer"
                                  id={`approve-btn-${appt.id}`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusChange(appt.id, "Rejected")}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-150 rounded-lg text-[11px] transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-gray-400 italic font-normal">Action Logged</span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
