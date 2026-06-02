/**
 * gynecologueService.js
 * =====================
 * Centralise tous les appels API côté gynécologue.
 */

import api from "@/services/api";

function unwrap(res) {
  return res?.data?.body ?? res?.data?.data ?? res?.data ?? null;
}
function asArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (Array.isArray(v.content)) return v.content;
  return [];
}
function fmt(d = {}) {
  return [d.prenom, d.nom].filter(Boolean).join(" ") || d.login || "";
}

// ── Patientes ────────────────────────────────────────────────────────────────

export async function fetchMesPatientes() {
  const res = await api.get("/api/patientes/mes-patientes");
  return asArray(unwrap(res)).map((p) => ({
    id: p.id,
    name: fmt(p) || "Patiente",
    prenom: p.prenom || "",
    nom: p.nom || "",
    phone: p.numeroTelephone || "",
    email: p.email || "",
    dossierMedicaleId: p.dossierMedicaleId || null,
  }));
}

// ── Dossier médical ──────────────────────────────────────────────────────────

export async function fetchDossierPatiente(patienteId) {
  const res = await api.get(`/api/dossiers/patiente/${patienteId}`);
  return unwrap(res);
}

export async function updateDossierPatiente(patienteId, payload) {
  const res = await api.put(`/api/dossiers/patiente/${patienteId}`, payload);
  return unwrap(res);
}

// ── Consultations ────────────────────────────────────────────────────────────

export async function fetchConsultationsPatiente(patienteId) {
  const res = await api.get(`/api/consultations/patientes/${patienteId}`);
  return asArray(unwrap(res)).map((c) => ({
    id: c.id,
    compteRendu: c.compteRendu || "",
    tension: c.tension,
    pouls: c.pouls,
    saturationOxygene: c.saturationOxygene,
    temperature: c.temperature,
    poulsBebe: c.poulsBebe,
    createdAt: c.createdAt || "",
    dossierMedicaleId: c.dossierMedicaleId,
  }));
}

export async function createConsultation(payload) {
  const res = await api.post("/api/consultations", payload);
  return unwrap(res);
}

// ── Ordonnances ──────────────────────────────────────────────────────────────

export async function fetchOrdonnancesConsultation(consultationId) {
  const res = await api.get(`/api/consultations/${consultationId}/ordonnances`);
  return asArray(unwrap(res));
}

export async function createOrdonnance(consultationId, payload) {
  const res = await api.post(`/api/consultations/${consultationId}/ordonnances`, payload);
  return unwrap(res);
}

export async function deleteOrdonnance(consultationId, ordonnanceId) {
  await api.delete(`/api/consultations/${consultationId}/ordonnances/${ordonnanceId}`);
}

// Dans gynecologueService.js
export async function addAnalyse(consultationId, dto, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("dto", JSON.stringify(dto));  // dto = { type, resultat }
  const res = await api.post(`/api/consultations/${consultationId}/analyses`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return unwrap(res);
}

// ── Médicaments ──────────────────────────────────────────────────────────────

export async function fetchMedicaments() {
  const res = await api.get("/api/medicaments");
  return asArray(unwrap(res)).map((m) => ({
    id: m.codeMedicament,
    nom: m.nomMedicament || "",
  }));
}

// ── Analyses (multipart) ─────────────────────────────────────────────────────

export async function fetchAnalysesConsultation(consultationId) {
  const res = await api.get(`/api/consultations/${consultationId}/analyses`);
  return asArray(unwrap(res));
}


// ── Imageries (multipart) ────────────────────────────────────────────────────

export async function fetchImageriesConsultation(consultationId) {
  const res = await api.get(`/api/consultations/${consultationId}/imageries`);
  return asArray(unwrap(res));
}

export async function addImagerie(consultationId, dto, file) {
  const form = new FormData();
  form.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
  form.append("file", file);
  const res = await api.post(`/api/consultations/${consultationId}/imageries`, form);
  return unwrap(res);
}