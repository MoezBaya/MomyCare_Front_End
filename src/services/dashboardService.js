import api from "@/services/api";

function unwrap(response) {
  return response?.data?.body || response?.data?.data || response?.data || null;
}

async function getFirstAvailable(urls) {
  for (const url of urls.filter((item) => item && !item.includes("undefined"))) {
    try {
      const response = await api.get(url);
      return unwrap(response);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }
    }
  }

  return null;
}

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.content)) return value.content;
  if (Array.isArray(value.items)) return value.items;
  if (Array.isArray(value.body)) return value.body;
  return [];
}

function fullName(person = {}) {
  return (
    person.name ||
    person.nomComplet ||
    [person.prenom, person.nom].filter(Boolean).join(" ") ||
    person.login ||
    person.username ||
    ""
  );
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";

  const text = String(value);
  const timeMatch = text.match(/\b\d{2}:\d{2}/);
  return timeMatch ? timeMatch[0] : text;
}

function normalizeStatus(value) {
  const status = String(value || "").toLowerCase();

  if (status.includes("attente") || status.includes("pending")) return "En attente";
  if (status.includes("annul") || status.includes("cancel")) return "Annulé";
  if (status.includes("pass") || status.includes("done")) return "Passé";
  return "Confirmé";
}

function normalizePatientProfile(profile, user) {
  const data = profile || user || {};

  return {
    id: data.id || user?.id,
    nom: fullName(data) || user?.login || "Patiente",
    matricule: data.matriculeSociale || data.matricule || data.numeroDossier || "--",
    birthday: formatDate(data.dateDeNaissance || data.birthday),
    phone: data.numeroTelephone || data.telephone || data.phone || "",
    email: data.email || user?.email || "",
    adresse: [data.adresse, data.ville].filter(Boolean).join(", ") || data.address || "",
    weekOfPregnancy: data.semaineGrossesse || data.weekOfPregnancy || "--",
    bloodType: data.groupeSanguin || data.bloodType || "--",
    allergies: data.allergies || "Non renseigne",
    lastDoctor: fullName(data.gynecologue || data.medecin) || "--",
  };
}

function normalizeDoctorProfile(profile, user) {
  const data = profile || user || {};

  return {
    id: data.id || user?.id,
    nom: fullName(data) || user?.login || "Gynecologue",
    email: data.email || user?.email || "",
    phone: data.numeroTelephone || data.telephone || data.phone || "",
    adresse: [data.adresse, data.ville].filter(Boolean).join(", ") || data.address || "",
    specialty: data.specialite || data.specialty || "Gynecologue Obstetricien",
    matriculeCachet: data.matriculeCachet || "--",
    numeroAgrement: data.numeroAgrement || "--",
    experience: data.experience || "--",
  };
}

function normalizeAppointment(appointment) {
  const patient = appointment.patient || appointment.patiente || {};
  const doctor = appointment.doctor || appointment.gynecologue || appointment.medecin || {};
  const dateValue = appointment.date || appointment.dateRendezVous || appointment.startTime;

  return {
    id: appointment.id || appointment.rendezVousId || `${dateValue}-${fullName(patient)}`,
    doctor: fullName(doctor) || appointment.doctorName || "--",
    patient: fullName(patient) || appointment.patientName || appointment.patienteName || "--",
    specialty: doctor.specialite || appointment.specialty || "Gynecologue Obstetricien",
    date: formatDate(dateValue),
    time: formatTime(appointment.heure || appointment.time || appointment.startTime || dateValue),
    status: normalizeStatus(appointment.status || appointment.statut || appointment.etat),
    type: appointment.type || appointment.motif || appointment.reason || "Consultation",
  };
}

function normalizePatient(patient) {
  return {
    id: patient.id,
    name: fullName(patient) || "Patiente",
    phone: patient.numeroTelephone || patient.telephone || patient.phone || "",
    email: patient.email || "",
    termDate: formatDate(patient.dateAccouchementPrevue || patient.termDate),
    progress: patient.semaineGrossesse ? `${patient.semaineGrossesse} sem` : patient.progress || "--",
  };
}

function normalizePrescription(prescription) {
  const patient = prescription.patient || prescription.patiente || {};

  return {
    id: prescription.id,
    patient: fullName(patient) || prescription.patientName || "--",
    date: formatDate(prescription.date || prescription.createdAt),
    meds: prescription.medicaments || prescription.meds || prescription.description || "--",
  };
}

function normalizeDoctor(doctor) {
  return {
    id: doctor.id,
    name: fullName(doctor) || "Docteur",
    specialty: doctor.specialite || doctor.specialty || "Gynecologue Obstetricien",
    hospital: doctor.hopital || doctor.cabinet || doctor.adresse || "",
    availability: doctor.disponibilite || doctor.availability || "",
    rating: doctor.rating || "",
  };
}

export async function loadPatientDashboardData(user) {
  const id = user?.id;

  const [profile, appointments, doctors] = await Promise.all([
    getFirstAvailable([
      `/api/patientes/${id}`,
      `/api/patiente/${id}`,
      `/api/patients/${id}`,
      "/api/patientes/me",
      "/api/patients/me",
      "/api/auth/me",
    ]),
    getFirstAvailable([
      `/api/rendezvous/patiente/${id}`,
      `/api/rendez-vous/patiente/${id}`,
      `/api/appointments/patient/${id}`,
      `/api/patients/${id}/appointments`,
      "/api/rendezvous/me",
    ]),
    getFirstAvailable([
      "/api/gynecologues",
      "/api/gynecologue",
      "/api/doctors",
      "/api/medecins",
    ]),
  ]);

  return {
    profile: normalizePatientProfile(profile, user),
    appointments: asArray(appointments).map(normalizeAppointment),
    doctors: asArray(doctors).map(normalizeDoctor),
  };
}

export async function loadDoctorDashboardData(user) {
  const id = user?.id;

  const [profile, appointments, patients, prescriptions] = await Promise.all([
    getFirstAvailable([
      `/api/gynecologues/${id}`,
      `/api/gynecologue/${id}`,
      `/api/doctors/${id}`,
      "/api/gynecologues/me",
      "/api/doctors/me",
      "/api/auth/me",
    ]),
    getFirstAvailable([
      `/api/rendezvous/gynecologue/${id}`,
      `/api/rendez-vous/gynecologue/${id}`,
      `/api/appointments/doctor/${id}`,
      `/api/gynecologues/${id}/appointments`,
      "/api/rendezvous/me",
    ]),
    getFirstAvailable([
      `/api/gynecologues/${id}/patientes`,
      `/api/gynecologues/${id}/patients`,
      `/api/patientes/gynecologue/${id}`,
      `/api/patients/doctor/${id}`,
      "/api/patientes",
    ]),
    getFirstAvailable([
      `/api/prescriptions/gynecologue/${id}`,
      `/api/ordonnances/gynecologue/${id}`,
      `/api/gynecologues/${id}/prescriptions`,
      "/api/prescriptions/me",
    ]),
  ]);

  return {
    profile: normalizeDoctorProfile(profile, user),
    appointments: asArray(appointments).map(normalizeAppointment),
    patients: asArray(patients).map(normalizePatient),
    prescriptions: asArray(prescriptions).map(normalizePrescription),
  };
}
