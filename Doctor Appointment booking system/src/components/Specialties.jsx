import React, { useRef } from "react";
import * as Icons from "lucide-react";
import { specialtiesData } from "../data/specialtiesData";
import { motion, useInView } from "motion/react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -24, scale: 0.96 },
  visible: { opacity: 1, x: 0,   scale: 1,   transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Specialties() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50/20 overflow-hidden" id="specialties-section">
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
            Medical Divisions
          </motion.h2>
          <p className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Consult Specialists Across Specialties
          </p>
          <motion.div
            className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          />
          <p className="text-gray-500 text-base leading-relaxed">
            MedBook supports quick matching filtered lookups. Explore qualified clinical practitioners across diverse fields of medicine.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {specialtiesData.map((spec, idx) => {
            const ResolvedIcon = Icons[spec.iconName] || Icons.Activity;
            return (
              <motion.div
                key={spec.id}
                variants={itemVariants}
                whileHover={{
                  y: -7,
                  boxShadow: "0 16px 44px -8px rgba(99,102,241,0.16)",
                  transition: { duration: 0.25 },
                }}
                className="bg-white border border-gray-100 p-6 rounded-2xl flex items-start gap-4 group cursor-default relative overflow-hidden"
              >
                {/* Hover glow overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-indigo-50/60 opacity-0 rounded-2xl"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className={`p-4 rounded-xl shrink-0 ${spec.color} relative z-10`}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 280, damping: 14 }}
                >
                  <ResolvedIcon className="w-6 h-6" />
                </motion.div>

                <div className="space-y-1.5 relative z-10">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                    {spec.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {spec.description}
                  </p>
                </div>

                {/* Corner accent */}
                <motion.div
                  className="absolute bottom-0 right-0 w-16 h-16 bg-indigo-50 rounded-tl-3xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
