// ─── AppointmentsTab ───────────────────────────────────────────────────
// Single Responsibility: onglet "Rendez-vous" uniquement

import { RendezVousCard } from "@/components/agenda/RendezVousCard";

export function AppointmentsTab({ appointments }) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-pink-200 bg-rose-50/70 p-10 text-center text-sm text-gray-500">
        Aucun rendez-vous n'est encore enregistré.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {appointments.map((appointment) => (
        <RendezVousCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}