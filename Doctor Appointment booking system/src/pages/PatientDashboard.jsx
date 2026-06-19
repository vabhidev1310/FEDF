import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  User, Search, Calendar, Star, CheckCircle, Clock, AlertTriangle, XCircle, 
  Download, Printer, FileText, BadgeAlert, Sparkles, Filter, Eye, HeartPulse
} from "lucide-react";
import { motion } from "motion/react";
import { getDoctors } from "../services/doctorService";
import { getAppointmentsByPatient, updateAppointmentStatus, rateDoctor } from "../services/appointmentService";
import DoctorCard from "../components/DoctorCard";
import AppointmentModal from "../components/AppointmentModal";

export default function PatientDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  
  // Tab states: 'history' | 'find'
  const [activeTab, setActiveTab] = useState("history");

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Booking states
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'booking' | 'slip' | 'rating'
  const [selectedAppointmentForSlip, setSelectedAppointmentForSlip] = useState(null);
  const [selectedAppointmentForRating, setSelectedAppointmentForRating] = useState(null);

  // Rating forms state
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState("");

  const specialties = ["All", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "General Medicine"];

  const loadPatientData = () => {
    const patientStr = localStorage.getItem("medbook_current_patient");
    if (!patientStr) {
      navigate("/patient-login");
      return;
    }
    const parsedPatient = JSON.parse(patientStr);
    setPatient(parsedPatient);
    
    // Fetch appointments for this specific patient
    const appts = getAppointmentsByPatient(parsedPatient.id);
    setAppointments(appts);

    // Fetch doctors list
    setDoctorsList(getDoctors());
  };

  useEffect(() => {
    loadPatientData();

    // Check if redirecting into specific tab from state
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
      // clear router state
      window.history.replaceState({}, document.title);
    }
  }, [location.pathname]);

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "Confirmed").length,
    pending: appointments.filter((a) => a.status === "Pending").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  };

  // Filter doctors based on search & specialization
  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialty === "All" || doc.specialization === selectedSpecialty;
    return matchesSearch && matchesSpec;
  });

  const handleCancelAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      updateAppointmentStatus(id, "Cancelled");
      loadPatientData(); // Refresh list
    }
  };

  const handleOpenSlip = (appt) => {
    setSelectedAppointmentForSlip(appt);
    setActiveModal("slip");
  };

  const handleOpenRating = (appt) => {
    setSelectedAppointmentForRating(appt);
    setUserRating(5);
    setUserReview("");
    setActiveModal("rating");
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppointmentForRating) return;

    rateDoctor(selectedAppointmentForRating.id, userRating, userReview);
    setActiveModal(null);
    loadPatientData(); // reload
    alert("Thank you for rating your doctor!");
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 animate-fade-in" id="patient-dashboard-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Patient Header Card */}
        {patient && (
          <div className="bg-gradient-to-r from-indigo-650 to-blue-600 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden" id="dashboard-welcome-banner">
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Patient Portal Active
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {patient.name}!</h1>
              <p className="text-sm text-indigo-50/90 max-w-sm">
                Check confirmed slots, select specialists, or look up your clinical history securely.
              </p>
            </div>
            {/* Quick blood info pill */}
            <div className="flex gap-4">
              <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md text-center border border-white/5 shadow-inner">
                <p className="text-[10px] text-indigo-150 uppercase font-black tracking-wider">Blood Group</p>
                <p className="text-lg font-black text-white">{patient.bloodGroup}</p>
              </div>
              <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md text-center border border-white/5 shadow-inner">
                <p className="text-[10px] text-indigo-150 uppercase font-black tracking-wider">Location</p>
                <p className="text-lg font-black text-white">{patient.city}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="dashboard-stats-grid">
          {[
            { label: "Total Bookings", value: stats.total, icon: FileText, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
            { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
            { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-100" },
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-5 rounded-2xl border ${stat.color} shadow-sm flex items-center gap-4 group`}>
              <div className="p-3.5 rounded-xl shrink-0">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs font-bold text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Actions and Tabs Controls */}
        <div className="bg-white border border-gray-150 rounded-2xl p-4 flex gap-2 overflow-x-auto shadow-inner" id="dashboard-navigator-tabs">
          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                : "bg-transparent text-gray-600 hover:text-indigo-650 hover:bg-slate-50"
            }`}
          >
            📋 Appointment History
          </button>
          <button
            onClick={() => setActiveTab("find")}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all cursor-pointer ${
              activeTab === "find"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                : "bg-transparent text-gray-600 hover:text-indigo-650 hover:bg-slate-50"
            }`}
            id="tab-find-doctors"
          >
            🔍 Find Doctors
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all bg-transparent text-gray-655 hover:text-indigo-655 hover:bg-slate-50 cursor-pointer"
          >
            👤 Update Profile Account
          </button>
        </div>

        {/* CONTENT SWITCHER */}
        {activeTab === "history" ? (
          /* TAB 1: APPOINTMENT HISTORY */
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-gray-150">
              <h2 className="text-xl font-bold text-gray-900">Your Appointment History</h2>
              <span className="text-xs text-gray-400">Synced in local log cache</span>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl py-12 px-4 text-center space-y-4">
                <BadgeAlert className="w-12 h-12 text-gray-300 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-950">No Bookings Found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    You haven't booked any medical appointments yet. Head over to the 'Find Doctors' tab to start!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("find")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow cursor-pointer uppercase tracking-wider"
                >
                  Search Medical Experts
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="appointments-history-list">
                {appointments.slice().reverse().map((appt) => {
                  
                  // Color codes
                  let statusBadge = "bg-amber-50 text-amber-700 border-amber-100";
                  if (appt.status === "Confirmed") statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  if (appt.status === "Rejected") statusBadge = "bg-rose-50 text-rose-700 border-rose-100";
                  if (appt.status === "Cancelled") statusBadge = "bg-slate-100 text-slate-500 border-slate-205";

                  return (
                    <motion.div
                      key={appt.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="bg-white border border-gray-150 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                    >
                      {/* Appointment head info */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs text-indigo-500 font-extrabold">{appt.id}</span>
                            <h3 className="font-extrabold text-gray-950 text-sm mt-0.5">{appt.doctorName}</h3>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{appt.doctorSpecialization}</p>
                          </div>
                          {/* Colored status badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border shrink-0 ${statusBadge}`}>
                            {appt.status}
                          </span>
                        </div>

                        <div className="h-px bg-slate-50"></div>

                        {/* Schedule properties */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-400 font-semibold text-[10px] uppercase">Consultation Date</p>
                            <p className="font-bold text-gray-800 mt-0.5">{appt.date}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-semibold text-[10px] uppercase">Clinic Slot</p>
                            <p className="font-bold text-gray-800 mt-0.5">{appt.timeSlot}</p>
                          </div>
                        </div>
                      </div>

                      {/* Controls and Receipt Slip access */}
                      <div className="pt-3 border-t border-gray-50 flex flex-wrap gap-2 items-center justify-between">
                        <p className="text-xs font-semibold text-gray-900">
                          Charged: ₹{appt.consultationFee}
                        </p>
                        
                        <div className="flex gap-2">
                          {/* Slip view */}
                          <button
                            onClick={() => handleOpenSlip(appt)}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 font-bold rounded-lg transition-all text-xs flex items-center gap-1.5 cursor-pointer border border-indigo-100"
                            title="Receipt slip viewer"
                          >
                            <Download className="w-3.5 h-3.5" /> Slip / Receipt
                          </button>

                          {/* Cancellation option if Pending / Confirmed */}
                          {(appt.status === "Pending" || appt.status === "Confirmed") && (
                            <button
                              onClick={() => handleCancelAppointment(appt.id)}
                              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-650 text-xs font-bold rounded-lg transition-all cursor-pointer border border-rose-100"
                            >
                              Cancel Booking
                            </button>
                          )}

                          {/* Ratings/reviews options if Confirmed/Completed and not rated */}
                          {appt.status === "Confirmed" && appt.rating === null && (
                            <button
                              onClick={() => handleOpenRating(appt)}
                              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-650 text-xs font-bold rounded-lg transition-all cursor-pointer border border-amber-100 flex items-center gap-1"
                            >
                              <Star className="w-3.5 h-3.5 fill-current" /> Rate Doctor
                            </button>
                          )}

                          {/* Display average rating if already rated */}
                          {appt.rating !== null && (
                            <span className="px-2.5 py-1.5 bg-slate-50 border border-gray-150 rounded-lg text-xs font-semibold text-gray-500 flex items-center gap-1">
                              My rating: <Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> {appt.rating}
                            </span>
                          )}

                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}

          </div>
        ) : (
          /* TAB 2: FIND DOCTORS */
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pb-2 border-b border-gray-150">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Search and Filter Medical Specialists</h2>
                <p className="text-xs text-gray-500 mt-1">Select across departments to establish a clinic session.</p>
              </div>

              {/* Instant Search input */}
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search doctor or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-250 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-950 outline-none transition-all shadow-sm"
                  id="doctor-search-input"
                />
              </div>
            </div>

            {/* Department Specialty filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2" id="doctor-specialty-filter">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1 whitespace-nowrap mr-2">
                <Filter className="w-3.5 h-3.5" /> Department:
              </span>
              {specialties.map((spec) => {
                const isActive = selectedSpecialty === spec;
                return (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? "bg-indigo-650 text-white border-indigo-650 shadow-md"
                        : "bg-white text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 border-gray-150"
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>

            {/* Search results doctors card mapping */}
            {filteredDoctors.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl py-12 px-4 text-center space-y-4">
                <BadgeAlert className="w-12 h-12 text-gray-300 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-950">No Match Found</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    We couldn't locate clinical experts matching your query. Please alter your search filters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="filtered-doctors-grid">
                {filteredDoctors.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    onBookClick={(doctorToBook) => {
                      setSelectedDoctorForBooking(doctorToBook);
                      setActiveModal("booking");
                    }}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* 1. SEPARATE SCHEDULER APPOINTMENT MODAL */}
      {activeModal === "booking" && selectedDoctorForBooking && (
        <AppointmentModal
          doctor={selectedDoctorForBooking}
          onClose={() => {
            setActiveModal(null);
            setSelectedDoctorForBooking(null);
          }}
          onBookingSuccess={() => {
            // refresh history logs
            loadPatientData();
          }}
        />
      )}

      {/* 2. RECEIPT INV/SLIP VIEWER MODAL */}
      {activeModal === "slip" && selectedAppointmentForSlip && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4" id="invoice-modal-overlay">
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-150 p-6 md:p-8 space-y-6 flex flex-col justify-between">
            
            {/* Modal Heading Title */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-indigo-500" /> Appointment Slip Receipt
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 hover:bg-slate-100 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                X
              </button>
            </div>

            {/* Printable Frame Area */}
            <div className="bg-slate-50 border-2 border-dashed border-gray-200 p-6 rounded-2xl relative" id="printable-receipt-slip">
              {/* Branding Header inside slip */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-200 mb-4">
                <div>
                  <h3 className="font-extrabold text-base text-indigo-650 flex items-center gap-1">
                    <HeartPulse className="w-4 h-4 text-indigo-500" /> MedBook Clinicians
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Online Care Appointment System</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-indigo-600 font-extrabold">{selectedAppointmentForSlip.id}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Status: <strong className="text-gray-900 uppercase font-black">{selectedAppointmentForSlip.status}</strong></p>
                </div>
              </div>

              {/* Slip content */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4 pb-2">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Patient Name</span>
                    <p className="font-bold text-gray-950 mt-0.5">{selectedAppointmentForSlip.patientName}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Contact: {selectedAppointmentForSlip.patientPhone || patient.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Consultant expert</span>
                    <p className="font-bold text-gray-950 mt-0.5">{selectedAppointmentForSlip.doctorName}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold">{selectedAppointmentForSlip.doctorSpecialization}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div className="grid grid-cols-2 gap-4 pb-2">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Appointment Date</span>
                    <p className="font-bold text-gray-950 mt-0.5">{selectedAppointmentForSlip.date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Clinic hour slot</span>
                    <p className="font-bold text-gray-950 mt-0.5">{selectedAppointmentForSlip.timeSlot}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-250"></div>

                <div className="flex justify-between items-center pt-2 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/50">
                  <span className="font-bold text-gray-750 text-[11px]">Total Consultation Fees Charged:</span>
                  <strong className="text-base text-gray-950 font-black">₹{selectedAppointmentForSlip.consultationFee}</strong>
                </div>
              </div>

              {/* Bottom legal notice */}
              <div className="text-center pt-4 text-[9px] text-gray-400 border-t border-gray-150 mt-4 italic font-medium leading-relaxed">
                * Please bring this printed/downloaded slip 15 minutes before your slot timeline directly to the MedBook branch clinic in {selectedAppointmentForSlip.doctorCity || "Location"}.
              </div>
            </div>

            {/* Print trigger and bottom menu closures */}
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-gray-250 hover:bg-slate-50 text-gray-600 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close Receipt
              </button>
              <button
                onClick={handlePrintSlip}
                className="px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow shadow-indigo-100 cursor-pointer"
                id="print-appointment-slip-btn"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save Slip
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. RATE DOCTOR MODAL */}
      {activeModal === "rating" && selectedAppointmentForRating && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRatingSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl border border-gray-100">
            
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-500 fill-current" /> Rate Your Consultant
              </h2>
              <p className="text-xs text-gray-500">
                Provide valuable rating stars regarding Dr. {selectedAppointmentForRating.doctorName.replace("Dr. ", "")}.
              </p>
            </div>

            <div className="space-y-4">
              {/* Stars selectors */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Select Stars</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = star <= userRating;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 hover:scale-115 transition-transform cursor-pointer"
                      >
                        <Star className={`w-8 h-8 ${isActive ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Tell Us About Your Experience</label>
                <textarea
                  rows="3"
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="The doctor was helpful and detailed..."
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-gray-250 hover:bg-slate-50 text-gray-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-lg cursor-pointer shadow-md"
              >
                Submit Feedback
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
