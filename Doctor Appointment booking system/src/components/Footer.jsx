import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, Heart, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 overflow-hidden" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8 border-b border-slate-800 pb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Logo / brand */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <motion.div
                className="p-1.5 bg-indigo-600 rounded-lg text-white"
                whileHover={{ scale: 1.12, rotate: 8 }}
                transition={{ type: "spring", stiffness: 280 }}
              >
                <Stethoscope className="w-4 h-4" />
              </motion.div>
              <span className="font-extrabold text-lg text-white group-hover:text-indigo-400 transition-colors">
                Med<span className="text-indigo-400">Book</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Providing modern, frictionless, and premium medical appointment planning tools for clinics, consultants, and proactive patients everywhere.
            </p>
            {/* Animated heartbeat line */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-indigo-600 to-transparent rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "80%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </motion.div>

          {/* Legal / resources */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Legal & Resources</h4>
            <ul className="text-xs space-y-2">
              <li className="text-slate-400">Patient privacy agreements, Terms of service and clinic guidelines.</li>
              <motion.li
                className="flex items-center gap-2 text-indigo-400 cursor-pointer"
                whileHover={{ x: 4, color: "#818cf8" }}
                transition={{ duration: 0.2 }}
              >
                <ExternalLink className="w-3 h-3" /> B.Tech Viva Project Guidelines (2026)
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Contact Information</h4>
            <div className="space-y-2 text-xs">
              {[
                { icon: Mail,  text: "yugror12@gmail.com" },
                { icon: Phone, text: "+1 (555) 019-9900"  },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 cursor-default"
                  whileHover={{ x: 4, color: "#a5b4fc" }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center text-xs gap-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>© {currentYear} MedBook Doctor Appointment Booking System. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Built with React, Tailwind &{" "}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            </motion.span>{" "}
            for Frontend Engineering
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
