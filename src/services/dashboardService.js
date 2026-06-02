

import api from "@/services/api";
import { fetchDisponibilitesGyneco, fetchMyDisponibilites } from "@/services/disponibiliteService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function unwrap(res) {
  return res?.data?.body ?? res?.data?.data ?? res?.data ?? null;
}

function asArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (Array.isArray(v.content)) return v.content;
  if (Array.isArray(v.body)) return v.body;
  return [];
}

function fullName({ prenom = "", nom = "", login = "" } = {}) {
  return [prenom, nom].filter(Boolean).join(" ") || login || "";
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function formatTime(value) {
  if (!value) return "";
  const match = String(value).match(/\b\d{2}:\d{2}/);
  return match ? match[0] : String(value);
}

// ✅ Mapping complet aligné sur le backend enum StatusRDV
// EN_ATTENTE, CONFIRME, ANNULE, REFUSER, TERMINE
function normalizeStatus(value) {
  const s = String(value || "").toUpperCase();
  if (s.includes("ATTENTE") || s.includes("PENDING")) return "En attente";
  if (s.includes("ANNUL")   || s.includes("CANCEL"))  return "Annulé";
  if (s.includes("REFUS"))                             return "Refusé";
  if (s.includes("TERMINE") || s.includes("DONE") || s.includes("PASS")) return "Terminé";
  if (s.includes("CONFIRME") || s.includes("CONFIRM")) return "Confirmé";
  return "En attente";
}

function formatAvailabilityLabel(dateTime) {
  if (!dateTime) return "";
  return `${formatDate(dateTime)} à ${formatTime(dateTime)}`;
}

// ─── Normaliseurs alignés sur les DTOs ────────────────────────────────────────

function normalizePatientProfile(d = {}) {
  return {
    id: d.id,
    nom: fullName(d) || "Patiente",
    prenom: d.prenom || "",
    email: d.email || "",
    phone: d.numeroTelephone || "",
    adresse: [d.adresse, d.ville].filter(Boolean).join(", "),
    matricule: d.matriculeSociale ? String(d.matriculeSociale) : "--",
    birthday: formatDate(d.dateDeNaissance),
    weekOfPregnancy: d.semaineGrossesse || "--",
    bloodType: d.groupeSanguin || "--",
    allergies: d.allergies || "Non renseigné",
    lastDoctor: "--",
    dossierMedicaleId: d.dossierMedicaleId || null,
  };
}

function normalizeDoctorProfile(d = {}) {
  return {
    id: d.id,
    nom: fullName(d) || "Gynécologue",
    prenom: d.prenom || "",
    email: d.email || "",
    phone: d.numeroTelephone || "",
    adresse: [d.adresse, d.ville].filter(Boolean).join(", "),
    specialty: "Gynécologue Obstétricien",
    matriculeCachet: d.matriculeCachet ? String(d.matriculeCachet) : "--",
    numeroAgrement: d.numeroAgrement || "--",
    experience: d.experience != null ? `${d.experience} ans` : "--",
  };
}

function normalizeAppointment(a = {}) {
  const dateValue = a.dateRendezVous || a.date || a.startTime || "";
  const patNom    = a.patienteNom    || a.patiente?.nom    || "";
  const patPrenom = a.patientePrenom || a.patiente?.prenom || "";
  const docNom    = a.gynecologueNom    || a.gynecologue?.nom    || "";
  const docPrenom = a.gynecologuePrenom || a.gynecologue?.prenom || "";

  return {
    id: a.id,
    patient: [patPrenom, patNom].filter(Boolean).join(" ") || "--",
    patienteId: a.patienteId,
    doctor: [docPrenom, docNom].filter(Boolean).join(" ") || "--",
    gynecologueId: a.gynecologueId,
    date: formatDate(dateValue),
    time: formatTime(dateValue),
    status: normalizeStatus(a.statusRDV || a.status || a.statut),
    type: a.motif || a.type || "Consultation",
    specialty: "Gynécologue Obstétricien",
  };
}

function normalizePatient(p = {}) {
  return {
    id: p.id,
    name: fullName(p) || "Patiente",
    phone: p.numeroTelephone || "",
    email: p.email || "",
    termDate: "--",
    progress: "--",
    dossierMedicaleId: p.dossierMedicaleId || null,
  };
}

function normalizeDoctor(d = {}) {
  return {
    id: d.id,
    name: fullName(d),
    specialty: "Gynécologue Obstétricien",
    hospital: [d.adresse, d.ville].filter(Boolean).join(", "),
    rating: d.rating || "",
    experience: d.experience ? `${d.experience} ans` : "",
  };
}

function normalizePrescription(p = {}) {
  const lignes = p.lignes || p.lignesOrdonnance || [];
  const meds = lignes
    .map((l) => l.medicamentNom || l.medicament || "")
    .filter(Boolean)
    .join(" • ") || p.medicaments || "--";

  return {
    id: p.id,
    consultationId: p.consultationId,
    patient: p.patienteNom || "--",
    date: formatDate(p.date || p.createdAt),
    meds,
  };
}

// ─── Exports utilisés par les composants ──────────────────────────────────────

export async function fetchAvailableGynecos() {
  const res = await api.get("/api/gynecologues");
  return asArray(unwrap(res)).map(normalizeDoctor);
}


export async function requestRdv(payload) {
  const body = {
    gynecologueId: payload.gynecologueId,
    dateRendezVous: payload.dateRendezVous
      || `${payload.date}T${payload.heure || "10:00"}:00`,
    motif: payload.motif || payload.type || "CONSULTATION",
  };
  const res = await api.post("/api/rdv", body);
  return unwrap(res);
}

export async function repondreRdv(rdvId, accepter) {
  const res = await api.patch(`/api/rdv/${rdvId}/repondre`, null, {
    params: { accepter },
  });
  return unwrap(res);
}

/** Dossier médical de la patiente connectée. */
export async function fetchPatientDossier() {
  const res = await api.get("/api/dossiers/mon-dossier");
  return unwrap(res);
}

/** Consultations de la patiente connectée. */
export async function fetchPatientConsultations() {
  const res = await api.get("/api/consultations/mes-consultations");
  return asArray(unwrap(res));
}

/** Analyses d'une consultation. */
export async function fetchConsultationAnalyses(consultationId) {
  const res = await api.get(`/api/consultations/${consultationId}/analyses`);
  return asArray(unwrap(res));
}

/** Imageries d'une consultation. */
export async function fetchConsultationImageries(consultationId) {
  const res = await api.get(`/api/consultations/${consultationId}/imageries`);
  return asArray(unwrap(res));
}

/** Ordonnances de la patiente via ses consultations. */
export async function fetchPatientPrescriptions() {
  let consultations = [];
  try {
    consultations = await fetchPatientConsultations();
  } catch {
    return [];
  }
  if (!consultations.length) return [];

  const results = await Promise.allSettled(
    consultations.map((c) =>
      api.get(`/api/consultations/${c.id}/ordonnances`).then((r) =>
        asArray(unwrap(r)).map((p) => ({ ...normalizePrescription(p), consultationId: c.id }))
      )
    )
  );

  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

/** Enregistrer une ordonnance (gynécologue). */
export async function savePrescription(consultationId, payload) {
  const res = await api.post(`/api/consultations/${consultationId}/ordonnances`, payload);
  return unwrap(res);
}

/** Dashboard gynécologue — tout en parallèle. */
export async function loadDoctorDashboardData() {
  const [profileRes, rdvRes, patientsRes] = await Promise.allSettled([
    api.get("/api/gynecologues/me"),
    api.get("/api/rdv/en-attente"),
    // endpoint backend réel pour les patientes du gynécologue connecté
    api.get("/api/patientes/mes-patientes"),
  ]);

  const profileSource = profileRes.status === "fulfilled" ? unwrap(profileRes.value) ?? {} : {};
  const profile = normalizeDoctorProfile(profileSource);
  const appointments = (
    rdvRes.status === "fulfilled" ? asArray(unwrap(rdvRes.value)) : []
  ).map(normalizeAppointment);
  const patients = (
    patientsRes.status === "fulfilled" ? asArray(unwrap(patientsRes.value)) : []
  ).map(normalizePatient);

  let availabilities = [];
  try {
    availabilities = await fetchMyDisponibilites(profileSource.id);
  } catch {
    availabilities = [];
  }

  return { profile, appointments, patients, prescriptions: [], availabilities };
}

/** Dashboard patiente — tout en parallèle. */
export async function loadPatientDashboardData() {
  const [profileRes, rdvRes, gynecosRes] = await Promise.allSettled([
    api.get("/api/patientes/me"),
    api.get("/api/rdv/mes-rdv"),
    api.get("/api/gynecologues"),
  ]);

  const profile = normalizePatientProfile(
    profileRes.status === "fulfilled" ? unwrap(profileRes.value) ?? {} : {}
  );
  const appointments = (
    rdvRes.status === "fulfilled" ? asArray(unwrap(rdvRes.value)) : []
  ).map(normalizeAppointment);
  const doctors = (
    gynecosRes.status === "fulfilled" ? asArray(unwrap(gynecosRes.value)) : []
  ).map(normalizeDoctor);

  return { profile, appointments, doctors };
}
