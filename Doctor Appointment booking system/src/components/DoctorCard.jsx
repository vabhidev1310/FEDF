import React from "react";
import { Star, Calendar, Clock, DollarSign, Award, ChevronRight, MapPin } from "lucide-react";
import { motion } from "motion/react";

export default function DoctorCard({ doctor, onBookClick }) {
  // Generate beautiful background initials-avatar
  const getInitials = (name) => {
    return name
      .replace("Dr. ", "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (spec) => {
    switch (spec) {
      case "Cardiology": return "from-rose-500 to-pink-600 shadow-rose-100";
      case "Dermatology": return "from-emerald-500 to-teal-600 shadow-emerald-100";
      case "Neurology": return "from-purple-500 to-indigo-600 shadow-purple-100";
      case "Pediatrics": return "from-amber-400 to-orange-500 shadow-amber-100";
      case "Orthopedics": return "from-blue-500 to-indigo-600 shadow-blue-100";
      default: return "from-indigo-550 to-blue-600 shadow-indigo-120";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-0.5"
    >
      <div>
        {/* Header Avatar and Basic Status */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${getAvatarColor(doctor.specialization)} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
            {getInitials(doctor.name)}
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-base">
              {doctor.name}
            </h3>
            <p className="text-xs font-semibold text-indigo-600 bg-indigo-50/70 inline-block px-2.5 py-0.5 rounded-full">
              {doctor.specialization}
            </p>
          </div>
        </div>

        {/* Doctor Bio */}
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2" title={doctor.bio}>
          {doctor.bio}
        </p>

        <div className="h-px bg-gray-100 my-3"></div>

        {/* Attributes Detail */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Experience: {doctor.experience}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>Clinic: {doctor.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <span className="font-medium text-gray-700">Days: </span>
              {doctor.availableDays.join(", ")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-405" />
            <span>{doctor.availableTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-gray-950">Consultation Fee: ₹{doctor.consultationFee}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-55/10 px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{doctor.rating}</span>
          </div>
          <span className="text-gray-400 font-medium">Available online</span>
        </div>

        {/* Action button */}
        <button
          onClick={() => onBookClick(doctor)}
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 group-hover:shadow-lg transition-all cursor-pointer"
          id={`book-doctor-${doctor.id}`}
        >
          Book Appointment
          <ChevronRight className="w-3.5 h-3.5 font-bold" />
        </button>
      </div>
    </motion.div>
  );
}
