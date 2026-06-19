import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Award, ShieldCheck, ArrowRight, UserPlus, Search } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { useScrollReveal } from "../hooks/useScrollReveal";

// Floating particle component
function Particle({ delay, x, y, size, color }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-60`}
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        x: [0, 8, 0],
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// Animated counter
function AnimatedCounter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const isNumber = !isNaN(parseInt(value));
  const numericPart = parseInt(value);
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!isNumber) return;
    let start = 0;
    const step = numericPart / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericPart) {
        setCount(numericPart);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [numericPart, duration, isNumber]);

  if (!isNumber) return <span>{value}</span>;
  return <span>{count}{suffix}</span>;
}

// 3D Tilt card hook
function useTilt(maxTilt = 8) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -maxTilt;
    const ry = ((x - cx) / cx) * maxTilt;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
    el.style.transition = "transform 0.1s ease";
  };
  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)";
    el.style.transition = "transform 0.5s cubic-bezier(.34,1.56,.64,1)";
  };
  return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave };
}

export default function Hero() {
  const navigate = useNavigate();
  useScrollReveal();

  // Mouse parallax for blobs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const blob1X = useTransform(mouseX, [0, 1], [-20, 20]);
  const blob1Y = useTransform(mouseY, [0, 1], [-20, 20]);
  const blob2X = useTransform(mouseX, [0, 1], [20, -20]);
  const blob2Y = useTransform(mouseY, [0, 1], [10, -10]);
  const springBlob1X = useSpring(blob1X, { stiffness: 50, damping: 20 });
  const springBlob1Y = useSpring(blob1Y, { stiffness: 50, damping: 20 });
  const springBlob2X = useSpring(blob2X, { stiffness: 40, damping: 25 });
  const springBlob2Y = useSpring(blob2Y, { stiffness: 40, damping: 25 });

  const tilt = useTilt(6);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };

  const handleFindDoctors = () => {
    const patient = localStorage.getItem("medbook_current_patient");
    navigate(patient ? "/patient-dashboard" : "/patient-login", patient ? { state: { activeTab: "find" } } : undefined);
  };

  const particles = [
    { delay: 0,   x: "8%",  y: "20%", size: 8,  color: "bg-indigo-400" },
    { delay: 0.8, x: "92%", y: "15%", size: 6,  color: "bg-blue-400" },
    { delay: 1.5, x: "15%", y: "75%", size: 5,  color: "bg-violet-400" },
    { delay: 0.4, x: "85%", y: "65%", size: 9,  color: "bg-teal-400" },
    { delay: 1.2, x: "50%", y: "88%", size: 4,  color: "bg-indigo-300" },
    { delay: 2.0, x: "70%", y: "30%", size: 7,  color: "bg-pink-300" },
    { delay: 0.6, x: "30%", y: "10%", size: 5,  color: "bg-sky-400" },
  ];

  const stats = [
    { value: "50+",   label: "Doctors",      icon: Users,      color: "text-indigo-600 bg-indigo-50" },
    { value: "500+",  label: "Patients",     icon: Award,      color: "text-emerald-600 bg-emerald-50" },
    { value: "1000+", label: "Appointments", icon: Calendar,   color: "text-blue-600 bg-blue-50" },
    { value: "24/7",  label: "Support",      icon: ShieldCheck,color: "text-rose-600 bg-rose-50" },
  ];

  return (
    <header
      className="relative bg-gradient-to-b from-indigo-50/70 via-indigo-50/20 to-white overflow-hidden py-16 md:py-24"
      id="hero-section"
      onMouseMove={handleMouseMove}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* Parallax blobs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 animate-morph-blob"
        style={{ x: springBlob1X, y: springBlob1Y }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl -z-10 animate-morph-blob animation-delay-300"
        style={{ x: springBlob2X, y: springBlob2Y }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl -z-10"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-semibold uppercase tracking-wider"
            >
              <motion.span
                className="flex h-2 w-2 rounded-full bg-indigo-600"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Modern Healthcare Platform
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight"
            >
              Book Your Doctor{" "}
              <br className="hidden sm:inline" />
              <span className="shimmer-text">Appointment Easily</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Find doctors, select available slots, and manage appointments online. Your health is our highest priority with frictionless care workflows.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            >
              <motion.button
                onClick={handleFindDoctors}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn-glow inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200/85 text-base cursor-pointer group animate-glow-pulse"
                id="hero-find-doctors-btn"
              >
                <Search className="w-5 h-5" />
                Find Doctors
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/patient-register")}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/20 text-gray-700 hover:text-indigo-600 font-semibold rounded-xl shadow-sm transition-all text-base cursor-pointer"
                id="hero-register-btn"
              >
                <UserPlus className="w-5 h-5 text-gray-500" />
                Register Now
              </motion.button>
            </motion.div>
          </div>

          {/* Right: Visual Card with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative flex justify-center"
          >
            <div
              {...tilt}
              className="relative bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full cursor-default"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Approved badge */}
              <motion.div
                className="absolute -top-4 -right-4 p-3 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl text-white shadow-lg shadow-emerald-200 text-xs font-bold flex items-center gap-1.5 z-10"
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldCheck className="w-4 h-4" /> Approved Doctors Only
              </motion.div>

              <div className="space-y-4">
                {[
                  { initials: "ST", name: "Dr. Sarah Taylor",    spec: "Cardiology • New York",  rating: "4.9", color: "bg-indigo-100 text-indigo-600",  delay: 0.4 },
                  { initials: "JS", name: "Dr. John Smith",      spec: "Dermatology • Boston",   rating: "4.7", color: "bg-emerald-100 text-emerald-600", delay: 0.55 },
                  { initials: "EV", name: "Dr. Elizabeth Vance", spec: "Neurology • Chicago",    rating: "4.8", color: "bg-violet-100 text-violet-600",   delay: 0.7  },
                ].map((doc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: doc.delay }}
                    whileHover={{ x: 4, backgroundColor: "rgba(238,242,255,0.5)" }}
                    className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-50 shadow-sm cursor-pointer transition-colors"
                  >
                    <div className={`w-12 h-12 ${doc.color} rounded-xl flex items-center justify-center font-bold text-lg`}>
                      {doc.initials}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-gray-900">{doc.name}</h3>
                      <p className="text-xs text-gray-500">{doc.spec}</p>
                    </div>
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold"
                    >
                      ★ {doc.rating}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating ring */}
            <motion.div
              className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border-4 border-indigo-200/60 -z-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -top-8 -right-8 w-16 h-16 rounded-full border-2 border-teal-200/50 -z-10"
              animate={{ rotate: -360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6" id="stats-section">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + idx * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6, boxShadow: "0 16px 40px -8px rgba(99,102,241,0.18)" }}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all text-center flex flex-col items-center justify-center group cursor-default"
            >
              <motion.div
                className={`p-3 rounded-xl mb-3 ${stat.color}`}
                whileHover={{ scale: 1.2, rotate: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <stat.icon className="w-6 h-6" />
              </motion.div>
              <p className="text-2xl font-extrabold text-gray-900">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </header>
  );
}
