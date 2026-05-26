import Dashboard from "@/pages/Dashboard";
import Login from "@/components/login/Login";
import Register from "@/components/register/Register";
import { PAGES } from "@/constants/appConstants";

// ─── AppRouter ────────────────────────────────────────────────
// S : décide uniquement quelle page afficher
// O : ajouter une page = ajouter un case ici, rien d'autre

export function AppRouter({
  page,
  authUser,
  loginMessage,
  onShowLogin,
  onShowRegister,
  onLoginSuccess,
  onRegisterSuccess,
  onLogout,
}) {
  if (page === PAGES.DASHBOARD && authUser) {
    return <Dashboard user={authUser} onLogout={onLogout} />;
  }

  if (page === PAGES.REGISTER) {
    return (
      <Register
        onShowLogin={onShowLogin}
        onRegisterSuccess={onRegisterSuccess}
      />
    );
  }

  return (
    <Login
      initialMessage={loginMessage}
      onShowRegister={onShowRegister}
      onLoginSuccess={onLoginSuccess}
    />
  );
}
