import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, role }) => {
  if (role === "patient") {
    const currentPatient = localStorage.getItem("medbook_current_patient");
    if (!currentPatient) {
      return <Navigate to="/patient-login" replace />;
    }
  } else if (role === "doctor") {
    const currentDoctor = localStorage.getItem("medbook_current_doctor");
    if (!currentDoctor) {
      return <Navigate to="/doctor-login" replace />;
    }
  }

  return children;
};
