import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ClipboardList, LogIn, Search, CalendarCheck, ShieldCheck, HeartPulse, Sparkles, ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Specialties from "../components/Specialties";
import FAQ from "../components/FAQ";
import ContactForm from "../components/ContactForm";
import { motion, useInView } from "motion/react";

const steps = [
  { step: "Step 1", title: "Register",           desc: "Create your secure Patient profile with contact info, blood group, and birthday.",                      icon: ClipboardList, color: "bg-indigo-100/80 text-indigo-700",  glow: "rgba(99,102,241,0.15)" },
  { step: "Step 2", title: "Login",               desc: "Access the dashboard securely utilizing your registered email credentials.",                           icon: LogIn,         color: "bg-teal-100/80 text-teal-700",    glow: "rgba(20,184,166,0.15)" },
  { step: "Step 3", title: "Search Doctor",       desc: "Filter through verified clinical professionals by specialization or search keywords.",                 icon: Search,        color: "bg-amber-100/80 text-amber-700",  glow: "rgba(245,158,11,0.15)" },
  { step: "Step 4", title: "Book Appointment",    desc: "Confirm selectable dates and real-time clinical slots to generate a digital slip.",                   icon: CalendarCheck, color: "bg-blue-100/80 text-blue-700",    glow: "rgba(59,130,246,0.15)" },
  { step: "Step 5", title: "Doctor Approval",     desc: "Experience live system notifications upon consultant confirmation or adjustments.",                   icon: ShieldCheck,   color: "bg-emerald-100/80 text-emerald-700", glow: "rgba(16,185,129,0.15)" },
  { step: "Step 6", title: "Visit Clinic",        desc: "Bring your downloaded receipt slip and visit the doctor for your custom exam.",                       icon: HeartPulse,    color: "bg-rose-100/80 text-rose-700",    glow: "rgba(244,63,94,0.15)" },
];

const bulletPoints = [
  "Separate secure patient and doctor credentials gates.",
  "Dynamic doctor lookup with specialization filters.",
  "Real-time automated scheduling sequencing (e.g. APT-001).",
  "Receipt printable slips with diagnostic data.",
  "Interactive ratings and medical feedback logs.",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const stepVariants = {
  hidden:  { opacity: 0, y: 36, scale: 0.94 },
  visible: { opacity: 1, y: 0,  scale: 1,  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const location = useLocation();
  const stepsRef  = useRef(null);
  const aboutRef  = useRef(null);
  const stepsInView = useInView(stepsRef,  { once: true, margin: "-80px" });
  const aboutInView = useInView(aboutRef,  { once: true, margin: "-80px" });

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  return (
    <div className="animate-fade-in" id="medbook-homepage">

      {/* 1. Hero */}
      <Hero />

      {/* 2. Services */}
      <Services />

      {/* 3. Specialties */}
      <Specialties />

      {/* 4. How It Works */}
      <section className="py-16 md:py-24 bg-white overflow-hidden" id="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <motion.h2
              className="text-xs font-bold text-indigo-600 uppercase tracking-widest"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Procedural Workflow
            </motion.h2>
            <p className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Six Easy Steps to Secure Care
            </p>
            <motion.div
              className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mx-auto"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            />
            <p className="text-gray-500 text-sm leading-relaxed">
              Our clinical portal automates bookings, approval logs, and patient records securely via optimized processes.
            </p>
          </motion.div>

          {/* Step cards */}
          <motion.div
            ref={stepsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
          >
            {steps.map((item, idx) => (
              <motion.div
                key={idx}
                variants={stepVariants}
                whileHover={{
                  y: -8,
                  boxShadow: `0 20px 50px -8px ${item.glow}`,
                  transition: { duration: 0.25 },
                }}
                className="relative bg-gradient-to-br from-slate-50 to-white border border-gray-150 rounded-2xl p-6 shadow-sm overflow-hidden cursor-default group"
              >
                {/* Step badge */}
                <span className="absolute top-0 right-0 py-1.5 px-4 bg-slate-100 group-hover:bg-indigo-50 font-extrabold text-[10px] uppercase text-slate-400 group-hover:text-indigo-500 rounded-bl-xl tracking-wider transition-colors duration-300">
                  {item.step}
                </span>

                {/* Hover glow overlay */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${item.glow}, transparent 70%)` }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Connector line (decorative) */}
                {idx < steps.length - 1 && (
                  <motion.div
                    className="absolute -right-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-indigo-200 to-transparent hidden lg:block"
                    initial={{ scaleX: 0 }}
                    animate={stepsInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1, duration: 0.4 }}
                    style={{ originX: 0 }}
                  />
                )}

                <div className="space-y-4 relative z-10">
                  <motion.div
                    className={`p-3.5 rounded-xl inline-block ${item.color}`}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 280, damping: 14 }}
                  >
                    <item.icon className="w-6 h-6" />
                  </motion.div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. About Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-gray-100 overflow-hidden" id="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" ref={aboutRef}>

            {/* Left: Visual card */}
            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              animate={aboutInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                className="relative bg-gradient-to-tr from-indigo-600 to-blue-700 p-8 text-white rounded-3xl shadow-xl max-w-md w-full space-y-6 cursor-default"
                whileHover={{ scale: 1.02, boxShadow: "0 28px 70px -12px rgba(99,102,241,0.4)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Background icon */}
                <motion.div
                  className="absolute top-6 right-6 opacity-10"
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.04, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <HeartPulse className="w-48 h-48 text-white" />
                </motion.div>

                <div className="space-y-2">
                  <motion.div
                    className="p-2 bg-white/20 inline-block rounded-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </motion.div>
                  <h3 className="text-2xl font-black tracking-tight pt-1">B.Tech Engineering Capstone</h3>
                  <p className="text-xs text-white/80">Developed for academic presentation & evaluation.</p>
                </div>

                <div className="space-y-3 font-semibold text-xs border-t border-white/20 pt-4">
                  {[
                    { label: "Topic scope:",    value: "Clinic Administrative Scheduling" },
                    { label: "Local Database:", value: "W3C Standard LocalStorage API" },
                    { label: "Routing:",        value: "HTML5 Browser Navigation" },
                  ].map(({ label, value }, i) => (
                    <motion.div
                      key={i}
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -12 }}
                      animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    >
                      <span className="text-white/70">{label}</span>
                      <span>{value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Orbiting decorations */}
              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full border-2 border-indigo-300/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -top-5 -right-5 w-14 h-14 rounded-full border-2 border-blue-300/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Right: Text */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 40 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            >
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Project Purpose</h3>
                <h2 className="text-3xl font-extrabold text-gray-900">Why MedBook?</h2>
                <motion.div
                  className="h-1 bg-indigo-600 rounded"
                  initial={{ width: 0 }}
                  animate={aboutInView ? { width: 48 } : {}}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                />
              </div>

              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  MedBook is built to bridge the operational gap between busy independent medical consultants and patient client schedules. Standard clinic systems are often slow, hard to manage, or heavily dependent on external hosting setups.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.42, duration: 0.5 }}
                >
                  This application simulates a fully functional scheduling service using <strong>React modular components</strong>, synchronized logins, and offline <strong>localStorage caches</strong>.
                </motion.p>
                <p className="font-semibold text-gray-900">Key Benefits & Highlights:</p>
                <ul className="space-y-2 text-xs">
                  {bulletPoints.map((point, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -16 }}
                      animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.09, duration: 0.4 }}
                    >
                      <motion.span
                        className="mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
                        whileHover={{ scale: 1.2, backgroundColor: "#6366f1", color: "#fff" }}
                      >
                        <ArrowRight className="w-2.5 h-2.5" />
                      </motion.span>
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <FAQ />

      {/* 7. Contact */}
      <ContactForm />

    </div>
  );
}
