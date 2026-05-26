import axios from "axios";
import { STORAGE_KEYS } from "@/constants/loginConstants";

// ─── S : chaque fonction a une seule responsabilité ───────────

// ── 1. Configuration de base ──────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── 2. Helpers ────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

function isPublicRoute(url = "") {
  return url.includes("/api/auth/");
}

function isRefreshRoute(url = "") {
  return url.includes("/api/auth/refresh");
}

// ── 3. Interceptor REQUEST ────────────────────────────────────
// Ajoute le Bearer token sur toutes les routes privées

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && !isPublicRoute(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── 4. Interceptor RESPONSE ───────────────────────────────────
// Gère les erreurs globales :
//   401 → token expiré → redirige vers login
//   403 → accès refusé
//   5xx → erreur serveur

let isRedirecting = false;

function handleUnauthorized() {
  if (isRedirecting) return;
  isRedirecting = true;

  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));

  // Déclenche un event custom → App.jsx écoute et redirige
  window.dispatchEvent(new CustomEvent("auth:logout", {
    detail: { reason: "session_expired" },
  }));

  isRedirecting = false;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const url     = error.config?.url ?? "";

    if (status === 401 && !isPublicRoute(url) && !isRefreshRoute(url)) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default api;
