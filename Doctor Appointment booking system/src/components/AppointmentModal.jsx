import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { bookAppointment } from "../services/appointmentService";

export default function AppointmentModal({ doctor, onClose, onBookingSuccess }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedDetails, setBookedDetails] = useState(null);
  
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const patientStr = localStorage.getItem("medbook_current_patient");
    if (patientStr) {
      setPatient(JSON.parse(patientStr));
    }
  }, []);

  // Standard selectable convenient slots
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
    "11:30 AM", "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  // Get weekday abbreviation for checking doctor availability
  const getDayAbbreviation = (dateString) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!patient) {
      setError("Please login as a patient first to book appointments.");
      return;
    }

    if (!selectedDate) {
      setError("Please select an appointment date.");
      return;
    }

    // Date validation - must be today or future
    const today = new Date();
    today.setHours(0,0,0,0);
    const chosenDate = new Date(selectedDate);
    chosenDate.setHours(0,0,0,0);
    if (chosenDate < today) {
      setError("We cannot schedule bookings in the past. Please select a future date.");
      return;
    }

    // Weekday availability validation
    const weekDay = getDayAbbreviation(selectedDate);
    if (!doctor.availableDays.includes(weekDay)) {
      setError(`${doctor.name} is not scheduled on ${weekDay}s. Scheduled days: ${doctor.availableDays.join(", ")}`);
      return;
    }

    if (!selectedSlot) {
      setError("Please select a convenient time slot.");
      return;
    }

    // Call service to book appointment
    const appointmentData = {
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone || "+1 (555) 000-0000",
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      doctorCity: doctor.city || "Clinic Location",
      date: selectedDate,
      timeSlot: selectedSlot,
      consultationFee: doctor.consultationFee,
    };

    try {
      const booked = bookAppointment(appointmentData);
      setBookedDetails(booked);
      setIsSuccess(true);
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err) {
      setError("An unexpected error occurred while booking. Please try again.");
    }
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in" id="appointment-modal-overlay">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 transform scale-100 transition-all">
        
        {/* Header Indicator */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400"></div>

        {/* Modal Main Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-gray-400 hover:text-gray-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Modal Heading Title */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-505" />
                Book Clinic Appointment
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure your consultation with our premium clinical partners.
              </p>
            </div>

            {/* Selected Doctor Summary */}
            <div className="bg-gradient-to-tr from-slate-50 to-indigo-50/30 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-650 rounded-xl text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                {doctor.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900">{doctor.name}</h3>
                <p className="text-xs font-semibold text-indigo-600">{doctor.specialization} specialist</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500 mt-1">
                  <span>Fee: ₹{doctor.consultationFee}</span>
                  <span>•</span>
                  <span>Days: {doctor.availableDays.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Patient Info Greeting */}
            {patient && (
              <div className="text-xs text-gray-500 bg-emerald-50/50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Booking for: <strong>{patient.name}</strong> ({patient.email})</span>
              </div>
            )}

            {/* Error Indicators */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Date Selector */}
              <div className="space-y-1.5 animate-slide-up">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Consultation Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={getTodayString()}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setError("");
                    }}
                    required
                    className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 px-4 text-sm text-gray-900 outline-none transition-all flex items-center cursor-pointer"
                    id="appointment-date-input"
                  />
                </div>
                {selectedDate && (
                  <p className="text-[11px] text-indigo-600 font-semibold">
                    Day selected: {getDayAbbreviation(selectedDate)}day
                  </p>
                )}
              </div>

              {/* Time Slots Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Time Slot ({doctor.availableTime})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 border border-gray-100 rounded-xl">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setError("");
                        }}
                        className={`py-2 px-1 text-center font-bold text-xs rounded-lg transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                            : "bg-white text-gray-600 hover:text-indigo-650 hover:bg-indigo-50/50 border-gray-150"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Summary & Book Submit */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Consultation Fee</p>
                <p className="text-xl font-black text-gray-950">₹{doctor.consultationFee}</p>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                id="sumbit-appointment-booking-btn"
              >
                Confirm Booking
              </button>
            </div>

          </form>
        ) : (
          /* SUCCESS PAGE */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Appointment Booked!</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                Your medical lookup was logged. Appointment is registered and is pending doctor approval.
              </p>
            </div>

            {/* Receipt Summary Details */}
            {bookedDetails && (
              <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl text-left text-xs space-y-2.5 max-w-sm mx-auto shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Appointment ID</span>
                  <span className="font-mono text-indigo-600 font-black text-sm">{bookedDetails.id}</span>
                </div>
                <div className="flex justify-between text-gray-650">
                  <span>Patient Name:</span>
                  <strong className="text-gray-900">{bookedDetails.patientName}</strong>
                </div>
                <div className="flex justify-between text-gray-650">
                  <span>Consultant Doctor:</span>
                  <strong className="text-gray-900">{bookedDetails.doctorName}</strong>
                </div>
                <div className="flex justify-between text-gray-650">
                  <span>Specialty Scope:</span>
                  <span className="text-indigo-600 font-semibold">{bookedDetails.doctorSpecialization}</span>
                </div>
                <div className="flex justify-between text-gray-650">
                  <span>Appointment Date:</span>
                  <strong className="text-gray-900">{bookedDetails.date}</strong>
                </div>
                <div className="flex justify-between text-gray-650">
                  <span>Scheduled Slot:</span>
                  <strong className="text-gray-900">{bookedDetails.timeSlot}</strong>
                </div>
                <div className="flex justify-between text-gray-650">
                  <span>Status:</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-bold text-[10px] uppercase">
                    {bookedDetails.status}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-center">
              <button
                onClick={onClose}
                className="w-full max-w-xs py-3 bg-indigo-600 hover:bg-indigo-750 text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                id="close-success-booking-modal-btn"
              >
                Close Receipt Overview
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
