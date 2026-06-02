import api from "@/services/api";

// ============================================================
//  HELPERS
// ============================================================

function unwrap(response) {
  return response?.data?.body ?? response?.data?.data ?? response?.data ?? null;
}

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  return [];
}

function formatDayOfWeek(day) {
  const days = {
    MONDAY: "Lundi", TUESDAY: "Mardi", WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi", FRIDAY: "Vendredi", SATURDAY: "Samedi", SUNDAY: "Dimanche"
  };
  return days[day] || day;
}

function normalizeDisponibilite(raw = {}) {
  return {
    id: raw.id,
    jourSemaine: raw.jourSemaine,
    jourLibelle: formatDayOfWeek(raw.jourSemaine),
    heureDebut: raw.heureDebut,
    heureFin: raw.heureFin,
    label: `${formatDayOfWeek(raw.jourSemaine)} ${raw.heureDebut} - ${raw.heureFin}`,
    gynecologueId: raw.gynecologueId,
  };
}

// ============================================================
//  API RÉELLE (BACKEND SPRING BOOT)
// ============================================================

/**
 * Récupère la liste des disponibilités (récurrentes) d'un gynécologue
 * GET /api/disponibilites/gyneco/{id}
 */
export async function fetchDisponibilitesGyneco(gynecologueId) {
  if (!gynecologueId) return [];
  try {
    const res = await api.get(`/api/disponibilites/gyneco/${gynecologueId}`);
    const data = asArray(unwrap(res));
    return data.map(normalizeDisponibilite);
  } catch (error) {
    console.error("Erreur fetchDisponibilitesGyneco:", error);
    return [];
  }
}

/**
 * Récupère mes propres disponibilités (gynécologue connecté)
 * GET /api/disponibilites/mes-disponibilites
 */
export async function fetchMyDisponibilites() {
  try {
    const res = await api.get("/api/disponibilites/mes-disponibilites");
    const data = asArray(unwrap(res));
    return data.map(normalizeDisponibilite);
  } catch (error) {
    console.error("Erreur fetchMyDisponibilites:", error);
    return [];
  }
}

/**
 * Ajoute une disponibilité récurrente
 * POST /api/disponibilites
 * Payload: { jourSemaine: "MONDAY", heureDebut: "09:00", heureFin: "12:00" }
 */
export async function addDisponibilite(gynecologueId, jourSemaine, heureDebut, heureFin) {
  if (!gynecologueId || !jourSemaine || !heureDebut || !heureFin) {
    throw new Error("Tous les champs sont requis (jourSemaine, heureDebut, heureFin)");
  }
  try {
    const payload = { jourSemaine, heureDebut, heureFin };
    const res = await api.post("/api/disponibilites", payload);
    return normalizeDisponibilite(unwrap(res));
  } catch (error) {
    console.error("Erreur addDisponibilite:", error);
    throw error;
  }
}

/**
 * Ajoute plusieurs disponibilités (batch – utilisée par le composant)
 */
export async function addDisponibilites(gynecologueId, slots = []) {
  // slots attendu: [{ jourSemaine, heureDebut, heureFin }]
  const results = [];
  for (const slot of slots) {
    try {
      const created = await addDisponibilite(gynecologueId, slot.jourSemaine, slot.heureDebut, slot.heureFin);
      results.push(created);
    } catch (err) {
      console.error("Erreur sur un créneau récurrent:", err);
    }
  }
  return results;
}

/**
 * Supprime une disponibilité récurrente par son ID (Long)
 * DELETE /api/disponibilites/{id}
 */
export async function deleteDisponibilite(slotId) {
  if (!slotId) throw new Error("slotId requis");
  try {
    await api.delete(`/api/disponibilites/${slotId}`);
    return true;
  } catch (error) {
    console.error("Erreur deleteDisponibilite:", error);
    throw error;
  }
}

// ============================================================
//  CRENEAUX PAR DATE (pour la réservation)
// ============================================================

/**
 * Récupère les créneaux disponibles pour une date précise
 * GET /api/disponibilites/gyneco/{gynecologueId}/creneaux?date=YYYY-MM-DD&disponiblesUniquement=true
 */
export async function fetchCreneauxForDay(gynecologueId, date, disponiblesUniquement = true) {
  if (!gynecologueId || !date) return [];

  try {
    const res = await api.get(`/api/disponibilites/gyneco/${gynecologueId}/creneaux`, {
      params: { date, disponiblesUniquement },
    });
    const data = asArray(unwrap(res));

    return data.map((creneau) => {
      const startDate = new Date(creneau.start);
      const endDate = new Date(creneau.end);
      const label = `${startDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;

      return {
        id: creneau.start, // clé unique
        start: creneau.start,
        end: creneau.end,
        available: creneau.available,
        label,
      };
    });
  } catch (error) {
    console.error("Erreur fetchCreneauxForDay:", error);
    return [];
  }
}