import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stethoscope, Heart } from "lucide-react";

// SVG path for ECG heartbeat line
const ECG_PATH =
  "M0,50 L30,50 L35,50 L40,20 L45,80 L50,10 L55,90 L60,50 L65,50 L100,50 L130,50 L135,50 L140,20 L145,80 L150,10 L155,90 L160,50 L165,50 L200,50";

// Floating orb for splash background
function SplashOrb({ x, y, size, color, delay }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        filter: `blur(${size * 0.4}px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3],
        scale: [0, 1.2, 0.8],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 3,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState("enter"); // enter -> exit

  useEffect(() => {
    // Auto-dismiss after the animation
    const timer = setTimeout(() => {
      setPhase("exit");
    }, 3200);

    const exitTimer = setTimeout(() => {
      onFinish?.();
    }, 4200);

    return () => {
      clearTimeout(timer);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  const orbs = [
    { x: "10%", y: "20%", size: 120, color: "rgba(99,102,241,0.3)", delay: 0.2 },
    { x: "75%", y: "15%", size: 90, color: "rgba(59,130,246,0.25)", delay: 0.4 },
    { x: "60%", y: "70%", size: 140, color: "rgba(139,92,246,0.2)", delay: 0.3 },
    { x: "20%", y: "75%", size: 100, color: "rgba(20,184,166,0.25)", delay: 0.5 },
    { x: "85%", y: "50%", size: 70, color: "rgba(244,63,94,0.2)", delay: 0.6 },
    { x: "40%", y: "10%", size: 60, color: "rgba(99,102,241,0.2)", delay: 0.1 },
  ];

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f0e1a 0%, #1a1145 40%, #0c1929 100%)" }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(12px)",
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          }}
          animate={phase === "exit" ? {
            opacity: 0,
            scale: 1.08,
            filter: "blur(12px)",
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          } : {}}
        >
          {/* Background orbs */}
          {orbs.map((orb, i) => (
            <SplashOrb key={i} {...orb} />
          ))}

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Central content */}
          <div className="relative flex flex-col items-center gap-6">

            {/* Pulsing ring behind the logo */}
            <motion.div
              className="absolute rounded-full border-2 border-indigo-400/30"
              style={{ width: 160, height: 160 }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: [0.6, 1.5, 0.6],
                opacity: [0, 0.4, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full border border-blue-400/20"
              style={{ width: 220, height: 220 }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [0.5, 1.4, 0.5],
                opacity: [0, 0.3, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />

            {/* Logo icon */}
            <motion.div
              className="relative z-10 p-5 bg-gradient-to-tr from-indigo-500 via-blue-500 to-violet-600 rounded-3xl shadow-2xl shadow-indigo-500/40"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.2,
              }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Stethoscope className="w-10 h-10 text-white" />
              </motion.div>

              {/* Heart pulse badge */}
              <motion.div
                className="absolute -top-2 -right-2 p-1.5 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-3.5 h-3.5 text-white fill-white" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              className="text-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className="text-white">Med</span>
                <span
                  className="bg-gradient-to-r from-indigo-400 via-blue-400 to-violet-400 bg-clip-text"
                  style={{ WebkitTextFillColor: "transparent" }}
                >
                  Book
                </span>
              </h1>
              <motion.p
                className="text-sm text-indigo-200/70 font-medium mt-2 tracking-widest uppercase"
                initial={{ opacity: 0, letterSpacing: "0.05em" }}
                animate={{ opacity: 1, letterSpacing: "0.2em" }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Modern Healthcare Platform
              </motion.p>
            </motion.div>

            {/* ECG Heartbeat line */}
            <motion.div
              className="relative z-10 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <svg
                width="240"
                height="60"
                viewBox="0 0 200 100"
                className="overflow-visible"
              >
                <motion.path
                  d={ECG_PATH}
                  fill="none"
                  stroke="url(#ecgGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 2, ease: "easeInOut", delay: 1.3 },
                    opacity: { duration: 0.3, delay: 1.3 },
                  }}
                />
                {/* Glow version of the line */}
                <motion.path
                  d={ECG_PATH}
                  fill="none"
                  stroke="url(#ecgGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.15"
                  filter="blur(4px)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 1.3 }}
                />
                <defs>
                  <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              className="flex items-center gap-2 mt-2 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom decorative gradient line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              background: "linear-gradient(90deg, transparent, #6366f1, #3b82f6, #8b5cf6, transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
          />

          {/* Corner accents */}
          <motion.div
            className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-2xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.div
            className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-blue-500/30 rounded-tr-2xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-violet-500/30 rounded-bl-2xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-indigo-500/30 rounded-br-2xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
