import { useAppNavigation } from "@/hooks/useAppNavigation";
import { AppRouter }        from "@/components/AppRouter";




export default function App() {
  const {
    page,
    authUser,
    loginMessage,
    showLogin,
    showRegister,
    handleLoginSuccess,
    handleLogout,
    handleRegisterSuccess,
  } = useAppNavigation();

  return (
    <AppRouter
      page={page}
      authUser={authUser}
      loginMessage={loginMessage}
      onShowLogin={showLogin}
      onShowRegister={showRegister}
      onLoginSuccess={handleLoginSuccess}
      onRegisterSuccess={handleRegisterSuccess}
      onLogout={handleLogout}
    />
  );
}
