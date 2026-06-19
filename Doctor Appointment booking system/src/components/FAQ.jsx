import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "First, click the 'Register' button and create a Patient Account. Once registered, login, go to the 'Find Doctors' section on your dashboard, search doctors by name or specialty, edit your details if needed, and press 'Book Appointment'. Select an available date and time slot, check the consultation fee, and confirm!"
  },
  {
    question: "Can I cancel appointments?",
    answer: "Yes, absolutely! On your Patient Dashboard, you will see your entire Appointment History under the first tab. Locate the booking you wish to cancel and click the red 'Cancel' button. Note that canceling an appointment will immediately notify the doctor and alter the appointment status code."
  },
  {
    question: "How does doctor approval work?",
    answer: "When you book, the system assigns a 'Pending' status badge to your appointment slot. The consultant doctor will receive a notification alert in their custom portal. They can review your name, profile card, and booking details to either 'Accept' (creates a 'Confirmed' badge) or 'Reject' (creates a 'Rejected' badge) the request."
  },
  {
    question: "Is there support available if I face login problems?",
    answer: "Yes! MedBook provides 24/7 technical customer assistance. You can fill out the contact form below or reach our support email address directly. Your queries are synced directly in our client records database."
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleAccordion = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-xs font-bold text-indigo-600 uppercase tracking-widest"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Got Questions? We Have Answers
          </p>
          <motion.div
            className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          />
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                  isOpen
                    ? "border-indigo-200 shadow-indigo-50/80 shadow-lg"
                    : "border-gray-150 hover:border-indigo-100 hover:shadow-md"
                }`}
              >
                {/* Question button */}
                <motion.button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className={`w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 gap-4 transition-colors cursor-pointer ${
                    isOpen ? "bg-indigo-50/60 text-indigo-700" : "bg-white hover:text-indigo-600 hover:bg-slate-50"
                  }`}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="flex items-center gap-2.5">
                    <motion.span
                      animate={{ rotate: isOpen ? 360 : 0, scale: isOpen ? 1.1 : 1 }}
                      transition={{ duration: 0.35, type: "spring" }}
                    >
                      <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? "text-indigo-600" : "text-indigo-400"}`} />
                    </motion.span>
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? "text-indigo-500" : "text-gray-400"}`} />
                  </motion.span>
                </motion.button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <motion.p
                        initial={{ y: -8 }}
                        animate={{ y: 0 }}
                        exit={{ y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 text-sm text-gray-600 leading-relaxed border-t border-indigo-100/60 bg-slate-50/50"
                      >
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
