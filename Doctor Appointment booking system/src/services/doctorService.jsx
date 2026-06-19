import { doctorsData } from "../data/doctorsData";

const DOCTORS_KEY = "medbook_doctors";

export const getDoctors = () => {
  const localDocs = localStorage.getItem(DOCTORS_KEY);
  if (!localDocs) {
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctorsData));
    return doctorsData;
  }
  return JSON.parse(localDocs);
};

export const getDoctorById = (id) => {
  const doctors = getDoctors();
  return doctors.find((doc) => doc.id === id) || null;
};

export const updateDoctorProfile = (doctorId, updatedFields) => {
  const doctors = getDoctors();
  const updatedDoctors = doctors.map((doc) => {
    if (doc.id === doctorId) {
      return { ...doc, ...updatedFields };
    }
    return doc;
  });
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(updatedDoctors));
  
  // also update current doctor storage if logged in and matches
  const currentDoctor = localStorage.getItem("medbook_current_doctor");
  if (currentDoctor) {
    const parsed = JSON.parse(currentDoctor);
    if (parsed.id === doctorId) {
      localStorage.setItem("medbook_current_doctor", JSON.stringify({ ...parsed, ...updatedFields }));
    }
  }
  return true;
};

export const loginDoctor = (email, password) => {
  const doctors = getDoctors();
  const foundDoctor = doctors.find((doc) => doc.email.toLowerCase() === email.toLowerCase());
  
  if (foundDoctor) {
    // For convenience in a B.Tech project presentation, any pre-loaded doctor can login with 'password123'
    // or if they set a custom password, we'll verify it.
    const expectedPassword = foundDoctor.password || "password123";
    if (password === expectedPassword) {
      localStorage.setItem("medbook_current_doctor", JSON.stringify(foundDoctor));
      return foundDoctor;
    }
  }
  return null;
};

export const registerDoctor = (doctorInfo) => {
  const doctors = getDoctors();
  const newDoctor = {
    ...doctorInfo,
    id: `doc-${Date.now()}`,
    rating: 5.0,
    password: doctorInfo.password || "password123"
  };
  doctors.push(newDoctor);
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
  return newDoctor;
};
