import { useState, useEffect } from "react";
import { PAGES, MESSAGES }    from "@/constants/appConstants";
import { clearSession, restoreSession } from "@/services/sessionService";

// ─── useAppNavigation ─────────────────────────────────────────
// S : gère uniquement navigation + état global
// D : écoute l'event "auth:logout" émis par api.js
//     → découplage total entre la couche HTTP et React

export function useAppNavigation() {
  const [authUser,     setAuthUser]     = useState(() => restoreSession());
  const [page,         setPage]         = useState(() => restoreSession() ? PAGES.DASHBOARD : PAGES.LOGIN);
  const [loginMessage, setLoginMessage] = useState("");

  // ── Écoute session expirée depuis api.js ──────────────────
  useEffect(() => {
    const onSessionExpired = () => {
      setAuthUser(null);
      setLoginMessage(MESSAGES.SESSION_EXPIRED);
      setPage(PAGES.LOGIN);
    };

    window.addEventListener("auth:logout", onSessionExpired);
    return () => window.removeEventListener("auth:logout", onSessionExpired);
  }, []);

  // ── Navigation ────────────────────────────────────────────
  const showLogin = (message = "") => {
    setLoginMessage(message);
    setPage(PAGES.LOGIN);
  };

  const showRegister = () => {
    setLoginMessage("");
    setPage(PAGES.REGISTER);
  };

  const handleLoginSuccess = (user) => {
    setAuthUser(user);
    setLoginMessage("");
    setPage(PAGES.DASHBOARD);
  };

  const handleLogout = () => {
    clearSession();
    setAuthUser(null);
    showLogin(MESSAGES.LOGGED_OUT);
  };

  const handleRegisterSuccess = () => {
    showLogin(MESSAGES.REGISTER_SUCCESS);
  };

  return {
    page,
    authUser,
    loginMessage,
    showLogin,
    showRegister,
    handleLoginSuccess,
    handleLogout,
    handleRegisterSuccess,
  };
}
