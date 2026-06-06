// src/components/dashboard/doctor/agenda/NextAppointments.jsx
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Fonction utilitaire pour déterminer la variante du badge selon le statut
const getBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmé": return "success";
    case "en attente": return "warning";
    case "annulé": return "destructive";
    case "terminé": return "secondary";
    default: return "outline";
  }
};

// Formatage lisible du statut
const formatStatus = (status) => {
  if (!status) return "—";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export function NextAppointments({ appointments = [] }) {
  if (!appointments.length) {
    return (
      <Card className="rounded-3xl border border-pink-100 bg-white shadow-sm">
        <CardContent className="p-5 text-center text-sm text-gray-500">
          Aucun rendez-vous à venir.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-pink-100 bg-white shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-4">Prochains rendez-vous</h3>

        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center gap-3 rounded-2xl border border-pink-50 bg-rose-50/30 p-3 transition hover:bg-rose-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                <Clock className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{appt.time}</p>
                <p className="text-xs text-gray-500">{appt.type}</p>
              </div>
              <Badge variant={getBadgeVariant(appt.status)} className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                {formatStatus(appt.status)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}