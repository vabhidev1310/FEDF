import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Stethoscope, ArrowLeft, HeartPulse, Sparkles, BadgeAlert } from "lucide-react";
import { getDoctors } from "../services/doctorService";
import DoctorCard from "../components/DoctorCard";
import AppointmentModal from "../components/AppointmentModal";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  
  // Modal states
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const specialties = ["All", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "General Medicine"];

  useEffect(() => {
    // Check if patient session exists, otherwise redirect first
    const patientStr = localStorage.getItem("medbook_current_patient");
    if (!patientStr) {
      navigate("/patient-login");
      return;
    }
    setDoctors(getDoctors());
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialty === "All" || doc.specialization === selectedSpecialty;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 animate-fade-in" id="book-appointment-standalone-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back navigation and title */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/patient-dashboard")}
              className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer text-gray-400 hover:text-indigo-650 transition-colors border border-gray-150"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">
                <Stethoscope className="w-5 h-5 text-indigo-505" />
                Schedule Clinical Consultations
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Find registered medical practitioners and select active hours.</p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full font-bold text-[10px] uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Verified Specialists
          </span>
        </div>

        {/* Filters and Inputs Wrapper */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <h2 className="font-extrabold text-sm text-gray-905">Refine Doctors Lookup</h2>
            
            {/* Search inputs */}
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, bio or specialities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-900 outline-none transition-all"
              />
            </div>
          </div>

          {/* Specialities filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 whitespace-nowrap mr-2">
              <Filter className="w-3.5 h-3.5" /> Filter Specialist:
            </span>
            {specialties.map((spec) => {
              const active = selectedSpecialty === spec;
              return (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    active
                      ? "bg-indigo-650 text-white border-indigo-650 shadow-sm"
                      : "bg-white text-gray-500 hover:text-indigo-650 hover:bg-slate-50 border-gray-150"
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctors Grid map */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl py-12 px-4 text-center space-y-3">
            <BadgeAlert className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-950">No Doctors Match Filters</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">Please clear your lookups, typing terms, or change specialty filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBookClick={(doctorSelected) => {
                  setSelectedDoctorForBooking(doctorSelected);
                  setShowBookingModal(true);
                }}
              />
            ))}
          </div>
        )}

      </div>

      {{/* Scheduling Pop-ups */}}
      {showBookingModal && selectedDoctorForBooking && (
        <AppointmentModal
          doctor={selectedDoctorForBooking}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDoctorForBooking(null);
          }}
          onBookingSuccess={() => {
            // Success booked, navigate back to view history
            setTimeout(() => {
              navigate("/patient-dashboard", { state: { activeTab: "history" } });
            }, 1000);
          }}
        />
      )}

    </div>
  );
}
