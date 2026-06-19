import { getDoctors, updateDoctorProfile } from "./doctorService";
import { addNotification } from "./notificationService";

const APPOINTMENTS_KEY = "medbook_appointments";

export const getAppointments = () => {
  const localApps = localStorage.getItem(APPOINTMENTS_KEY);
  return localApps ? JSON.parse(localApps) : [];
};

export const getAppointmentById = (id) => {
  const appointments = getAppointments();
  return appointments.find((app) => app.id === id) || null;
};

export const getAppointmentsByPatient = (patientId) => {
  const appointments = getAppointments();
  return appointments.filter((app) => app.patientId === patientId);
};

export const getAppointmentsByDoctor = (doctorId) => {
  const appointments = getAppointments();
  return appointments.filter((app) => app.doctorId === doctorId);
};

export const bookAppointment = (appointmentData) => {
  const appointments = getAppointments();
  
  // Generate ID like APT-001, APT-002, etc.
  let nextNum = 1;
  if (appointments.length > 0) {
    const ids = appointments.map(app => {
      const match = app.id.match(/APT-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    nextNum = Math.max(...ids) + 1;
  }
  const formattedId = `APT-${String(nextNum).padStart(3, "0")}`;
  
  const newAppointment = {
    id: formattedId,
    status: "Pending",
    rating: null,
    review: "",
    createdAt: new Date().toISOString(),
    ...appointmentData
  };
  
  appointments.push(newAppointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  
  // Create notifications for both Patient and Doctor
  addNotification(
    appointmentData.patientId,
    `Your appointment request (${formattedId}) with ${appointmentData.doctorName} has been booked and is pending approval.`
  );
  
  addNotification(
    appointmentData.doctorId,
    `New appointment requested by ${appointmentData.patientName} for ${appointmentData.date} at ${appointmentData.timeSlot}.`
  );
  
  return newAppointment;
};

export const updateAppointmentStatus = (id, status) => {
  const appointments = getAppointments();
  let updatedApp = null;
  
  const updatedAppointments = appointments.map((app) => {
    if (app.id === id) {
      updatedApp = { ...app, status };
      return updatedApp;
    }
    return app;
  });
  
  if (updatedApp) {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
    
    // Notify elements
    let patientMsg = "";
    let doctorMsg = "";
    
    switch (status) {
      case "Confirmed":
        patientMsg = `Your appointment ${id} with ${updatedApp.doctorName} has been APPROVED for ${updatedApp.date} at ${updatedApp.timeSlot}.`;
        doctorMsg = `You approved appointment ${id} with ${updatedApp.patientName}.`;
        break;
      case "Rejected":
        patientMsg = `Your appointment ${id} with ${updatedApp.doctorName} was rejected. Please select another slot.`;
        doctorMsg = `You rejected appointment ${id} with ${updatedApp.patientName}.`;
        break;
      case "Cancelled":
        patientMsg = `You successfully cancelled your appointment ${id} with ${updatedApp.doctorName}.`;
        doctorMsg = `Patient ${updatedApp.patientName} has cancelled appointment ${id} scheduled for ${updatedApp.date}.`;
        break;
      default:
        break;
    }
    
    if (patientMsg) addNotification(updatedApp.patientId, patientMsg);
    if (doctorMsg) addNotification(updatedApp.doctorId, doctorMsg);
  }
  
  return updatedApp;
};

export const rateDoctor = (appointmentId, rating, review) => {
  const appointments = getAppointments();
  let targetDoctorId = null;
  
  const updatedAppointments = appointments.map((app) => {
    if (app.id === appointmentId) {
      targetDoctorId = app.doctorId;
      return { ...app, rating, review };
    }
    return app;
  });
  
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
  
  // Recalculate and update the doctor's average rating in local storage
  if (targetDoctorId) {
    const allApps = getAppointments();
    // find all rated appointments for this doctor
    const docRatings = allApps
      .filter((app) => app.doctorId === targetDoctorId && app.rating !== null)
      .map((app) => app.rating);
      
    // Include the new rating specifically if not yet updated in the fetch
    const uniqueRatingSum = docRatings.reduce((sum, r) => sum + r, 0);
    const uniqueRatingCount = docRatings.length;
    
    let newAvgRating = 4.8; // Default fallback if no ratings
    if (uniqueRatingCount > 0) {
      newAvgRating = parseFloat((uniqueRatingSum / uniqueRatingCount).toFixed(1));
    }
    
    updateDoctorProfile(targetDoctorId, { rating: newAvgRating });
  }
  
  return true;
};
