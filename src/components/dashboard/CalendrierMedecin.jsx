import { CalendarDays, Clock, Check, X, Calendar } from "lucide-react";

export default function CalendrierMedecin({ appointments = [] }) {
  return (
    <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-black text-gray-950">Calendrier du médecin</h3>
          <p className="text-sm text-gray-500">Vue synthétique des rendez-vous et de l'activité du planning.</p>
        </div>
        <CalendarDays className="h-6 w-6 text-rose-500" />
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-3xl border border-pink-50 bg-rose-50/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-gray-900">{appointment.patient || appointment.patiente || "Patiente inconnue"}</p>
                  <p className="text-xs text-gray-500">{appointment.type || "Consultation"}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-600 border border-rose-100">
                  <Clock className="h-3.5 w-3.5" />
                  {appointment.time || appointment.heure || "--"}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-rose-500" />
                  {appointment.date || appointment.dateRendezVous || "Date non précisée"}
                </span>
                <span className="inline-flex items-center gap-1">
                  {appointment.status === "Confirmé" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-rose-500" />}
                  {appointment.status || "Statut inconnu"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
          Aucun rendez-vous planifié.
        </div>
      )}
    </section>
  );
}
