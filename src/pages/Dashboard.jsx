import { LogOut, Loader2 } from "lucide-react";

import PatientDashboard from "@/components/dashboard/PatientDashboard";
import DoctorDashboard from "@/components/dashboard/doctor/DoctorDashboard";
import MomyCareLogo from "@/components/shared/MomyCareLogo";
import { Button } from "@/components/ui/button";
import { normalizeRole } from "@/utils/roleUtils";

export default function Dashboard({ user, onLogout }) {
  const resolvedRole = normalizeRole(user?.role || user?.roles);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex flex-col items-center justify-center gap-4">
        <MomyCareLogo size="lg" variant="col" />

        <div className="flex items-center gap-2 text-rose-500">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span className="text-sm font-semibold">
            Chargement de votre espace...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex flex-col items-center justify-center gap-6 p-4">
        <MomyCareLogo size="lg" variant="col" />

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Session expiree
          </h2>

          <p className="text-sm text-gray-500">
            Veuillez vous reconnecter pour acceder a votre espace.
          </p>
        </div>

        <Button
          onClick={onLogout}
          variant="outline"
          className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Se reconnecter
        </Button>
      </div>
    );
  }

  if (resolvedRole === "patiente") {
    return <PatientDashboard user={user} onLogout={onLogout} />;
  }

  if (resolvedRole === "gynecologue") {
    return <DoctorDashboard user={user} onLogout={onLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex flex-col items-center justify-center gap-6 p-4">
      <MomyCareLogo size="lg" variant="col" />

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Role non reconnu
        </h2>

        <p className="text-sm text-gray-500">
          Aucun role valide trouve pour cet utilisateur.
        </p>
      </div>

      <Button
        onClick={onLogout}
        variant="outline"
        className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Se deconnecter
      </Button>
    </div>
  );
}
