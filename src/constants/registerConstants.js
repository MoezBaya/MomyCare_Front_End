// ─── API Endpoints ────────────────────────────────────────────
export const API_ENDPOINTS = {
  patiente:    "/api/auth/register/patiente",
  gynecologue: "/api/auth/register/gynecologue",
};

// ─── Initial Form State ───────────────────────────────────────
export const INITIAL_FORM_DATA = {
  role:             "patiente",
  login:            "",
  email:            "",
  password:         "",
  confirmPassword:  "",
  nom:              "",
  prenom:           "",
  dateDeNaissance:  "",
  adresse:          "",
  ville:            "",
  numeroTelephone:  "",
  matriculeSociale: "",
  matriculeCachet:  "",
  numeroAgrement:   "",
  experience:       "",
};

// ─── Roles ────────────────────────────────────────────────────
export const ROLES = {
  PATIENTE:    "patiente",
  GYNECOLOGUE: "gynecologue",
};
