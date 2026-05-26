import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/registerConstants";

// ─── Payload Builders ─────────────────────────────────────────

function buildCommonPayload(data) {
  return {
    login:           data.login,
    email:           data.email,
    password:        data.password,
    nom:             data.nom,
    prenom:          data.prenom,
    dateDeNaissance: data.dateDeNaissance,
    adresse:         data.adresse,
    ville:           data.ville,
    numeroTelephone: data.numeroTelephone,
  };
}

function buildPatientePayload(data) {
  return {
    ...buildCommonPayload(data),
    matriculeSociale: Number(data.matriculeSociale),
  };
}

function buildGynecologuePayload(data) {
  return {
    ...buildCommonPayload(data),
    matriculeCachet: Number(data.matriculeCachet),
    numeroAgrement:  data.numeroAgrement,
    experience:      Number(data.experience),
  };
}

// ─── Service Principal ────────────────────────────────────────

/**
 * Envoie la requête d'inscription selon le rôle
 */
export async function registerUser(data) {
  const isGynecologue = data.role === "gynecologue";

  const url     = isGynecologue ? API_ENDPOINTS.gynecologue : API_ENDPOINTS.patiente;
  const payload = isGynecologue
    ? buildGynecologuePayload(data)
    : buildPatientePayload(data);

  return api.post(url, payload, {
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Extrait le message d'erreur depuis la réponse backend
 */
export function extractErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Impossible de creer le compte. Verifiez les informations puis reessayez."
  );
}
