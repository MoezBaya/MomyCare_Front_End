import PatientDashboard from "../dashboard/PatientDashboard";
import DoctorDashboard from "../dashboard/DoctorDashboard";

const ROLE_COMPONENTS = {
  patiente: PatientDashboard,
  gynecologue: DoctorDashboard,
};

function normalizeRole(role) {
  if (!role) return null;

  const normalized = String(role)
    .toLowerCase()
    .replace("role_", "");

  return normalized;
}

export function RoleRouter({ role, user, onLogout }) {

  const normalizedRole = normalizeRole(role);

  const DashboardComponent =
    ROLE_COMPONENTS[normalizedRole];

  if (!DashboardComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6">
        <div className="bg-white rounded-3xl border border-rose-100 p-8 text-center max-w-sm space-y-4 shadow-lg">

          <h2 className="text-xl font-bold text-gray-800">
            Rôle non reconnu
          </h2>

          <p className="text-sm text-gray-500">
            Aucun rôle valide trouvé pour cet utilisateur.
          </p>

          <div className="text-xs text-rose-500 font-mono bg-rose-50 rounded-lg p-2">
            {String(role)}
          </div>

          <button
            onClick={onLogout}
            className="text-sm font-semibold text-rose-600 underline cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardComponent
      user={user}
      onLogout={onLogout}
    />
  );
}