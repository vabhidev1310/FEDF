import React, { useEffect, useRef } from "react";
import { Search, CalendarCheck, ShieldAlert, HeartHandshake } from "lucide-react";
import { motion, useInView } from "motion/react";

const servicesList = [
  {
    title: "Doctor Search",
    description: "Search specialized clinical professionals by doctor name, specialization scope, or available cities instantly.",
    icon: Search,
    bg: "bg-indigo-50 text-indigo-600",
    accent: "border-indigo-100",
    glow: "rgba(99,102,241,0.15)",
    gradient: "from-indigo-50 to-indigo-100/50",
  },
  {
    title: "Appointment Booking",
    description: "Select convenient date slots, choose preferred times, review costs, and generate unique booking ticket systems.",
    icon: CalendarCheck,
    bg: "bg-emerald-50 text-emerald-600",
    accent: "border-emerald-100",
    glow: "rgba(16,185,129,0.15)",
    gradient: "from-emerald-50 to-emerald-100/50",
  },
  {
    title: "Appointment Tracking",
    description: "Monitor approval status through active color-coded badges matching pending, confirmed, rejected or cancelled states.",
    icon: ShieldAlert,
    bg: "bg-amber-50 text-amber-600",
    accent: "border-amber-100",
    glow: "rgba(245,158,11,0.15)",
    gradient: "from-amber-50 to-amber-100/50",
  },
  {
    title: "Online Health Records",
    description: "Store registered information, edit medical bio notes, and download official digital receipts of your bookings.",
    icon: HeartHandshake,
    bg: "bg-blue-50 text-blue-600",
    accent: "border-blue-100",
    glow: "rgba(59,130,246,0.15)",
    gradient: "from-blue-50 to-blue-100/50",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 40, scale: 0.94 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const headerVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-24 bg-white border-y border-gray-50 overflow-hidden" id="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={headerVariants}
        >
          <motion.h2
            className="text-xs font-bold text-indigo-600 uppercase tracking-widest"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Our Medical Services
          </motion.h2>
          <p className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Integrated Solutions Offering Quality Patient Care
          </p>
          <motion.div
            className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          />
          <p className="text-gray-500 text-base leading-relaxed">
            MedBook provides a frictionless clinic administrative flow designed specifically to help patients connect with primary health care specialists effortlessly.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {servicesList.map((service, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow: `0 20px 50px -8px ${service.glow}`,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className={`bg-white border rounded-2xl p-6 transition-colors duration-300 flex flex-col justify-between ${service.accent} cursor-default group relative overflow-hidden`}
            >
              {/* Subtle gradient background on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 rounded-2xl`}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className={`p-3.5 rounded-xl inline-block mb-5 ${service.bg}`}
                  whileHover={{ scale: 1.18, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <service.icon className="w-6 h-6" />
                </motion.div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <motion.span
                className="relative z-10 text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Real-time System{" "}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
