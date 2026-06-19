import React, { useState } from "react";
import { Send, MapPin, Mail, Phone, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const contactItems = [
  { icon: MapPin, title: "Our Location",      detail: "MedBook Plaza, Medical Square, NY 10001",   color: "bg-indigo-50 text-indigo-600" },
  { icon: Mail,   title: "Email Support",     detail: "yugror12@gmail.com",                         color: "bg-blue-50 text-blue-600" },
  { icon: Phone,  title: "Emergency Hotline", detail: "+1 (555) 019-9900",                          color: "bg-emerald-50 text-emerald-600" },
  { icon: Clock,  title: "Clinic Support Hours", detail: "Mon - Sat: 08:00 AM - 08:00 PM",         color: "bg-violet-50 text-violet-600" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);

    try {
      await fetch("https://formsubmit.co/ajax/yugror12@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: "New Contact Form Submission from MedBook",
          _autoresponse: "Thank you for reaching out to MedBook! We have received your message and our team will get back to you shortly.",
        }),
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }

    const localContacts = localStorage.getItem("medbook_contacts");
    const contacts = localContacts ? JSON.parse(localContacts) : [];
    contacts.push({ id: `contact-${Date.now()}`, ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem("medbook_contacts", JSON.stringify(contacts));

    setFormData({ name: "", email: "", message: "" });
    setIsSuccess(true);
    setIsSubmitting(false);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-tr from-indigo-50/20 to-white border-t border-gray-100 overflow-hidden" id="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Left: Info Panel */}
          <motion.div
            className="lg:col-span-5 space-y-8 flex flex-col justify-between"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.h2
                className="text-xs font-bold text-indigo-600 uppercase tracking-widest"
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Get in Touch
              </motion.h2>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                We're Here to Assist You Always
              </p>
              <motion.div
                className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              />
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                Have custom questions regarding our platform features, doctor matching codes, or B.Tech engineering viva presentation files? Reach out to us.
              </p>
            </div>

            {/* Contact items */}
            <div className="space-y-5">
              {contactItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.15 + idx * 0.1, ease: "easeOut" }}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className="flex gap-4 items-start cursor-default group"
                >
                  <motion.div
                    className={`p-3 ${item.color} rounded-xl shrink-0 shadow-sm`}
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 280 }}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-xs text-gray-400 font-semibold italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              * In case of general health emergencies, please call 911 directly.
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-gray-150 shadow-xl relative overflow-hidden flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          >
            {/* Decorative corner blob */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50/60 rounded-full blur-2xl pointer-events-none"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Success banner */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex items-center gap-3 relative z-10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                    <p className="text-xs text-emerald-600/90 mt-0.5">Your inquiry has been stored locally in client submissions.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <motion.div
                  className="space-y-1.5"
                  animate={{ scale: focusedField === "name" ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Your Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all duration-200"
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  className="space-y-1.5"
                  animate={{ scale: focusedField === "email" ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Your Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all duration-200"
                  />
                </motion.div>
              </div>

              {/* Message */}
              <motion.div
                className="space-y-1.5"
                animate={{ scale: focusedField === "message" ? 1.005 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Detailed Inquiry Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Type your questions or concerns here..."
                  className="w-full bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] rounded-xl py-3 px-4 text-xs text-gray-900 outline-none transition-all duration-200 resize-none"
                />
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="btn-glow w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-colors cursor-pointer"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isSubmitting ? (
                    <motion.span
                      key="loading"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Send className="w-4 h-4" /> Submit Inquiry Details
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
