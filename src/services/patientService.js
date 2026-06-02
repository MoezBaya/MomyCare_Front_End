import api from "@/services/api";
import {
  loadPatientDashboardData,
  fetchAvailableGynecos,
} from "@/services/dashboardService";

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

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatTime(value) {
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

export const loadPatientDashboard = async () => {
  return await loadPatientDashboardData();
};

export const fetchPatientAppointments = async () => {
  try {
    const res = await api.get("/api/rdv/mes-rdv");
    const appointments = asArray(unwrap(res)).map(normalizeAppointment);
    return appointments;
  } catch (err) {
    console.error("[fetchPatientAppointments] Erreur :", err?.message);
    return [];
  }
};

export { fetchAvailableGynecos };
