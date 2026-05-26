// ─── API ──────────────────────────────────────────────────────
export const API_LOGIN_URL = "/api/auth/signin";

// ─── Role Mapping ─────────────────────────────────────────────
export const ROLE_REDIRECT = {
  ROLE_GYNECOLOGUE: "gynecologue",
  ROLE_PATIENTE:    "patiente",
};

export const DEFAULT_REDIRECT = "dashboard";

// ─── LocalStorage Keys ────────────────────────────────────────
export const STORAGE_KEYS = {
  TOKEN:    "token",
  USER:     "user",
  ROLES:    "roles",
  USER_ID:  "userId",
  LOGIN:    "login",
  EMAIL:    "email",
};
