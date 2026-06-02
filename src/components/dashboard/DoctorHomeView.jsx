import { Calendar, Clock, ClipboardList, HeartPulse, Users, Plus, Check, X } from "lucide-react";

export default function DoctorHomeView({
  docName,
  counts,
  appointments,
  onConfirmAppointment,
  onCancelAppointment,
  onOpenAddAppointment,
  onViewDossier,
}) {
  return (
    <>
      <div className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">
          Bonjour, Dr. {docName}
        </h1>
        <p className="text-sm font-semibold text-gray-400">
          Voici un aperçu de votre journée de consultations et de suivis de grossesse.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article className="rounded-3xl border border-pink-100 bg-[#fef1f6] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-rose-600">RDV Aujourd'hui</p>
            <h2 className="text-4xl font-black text-rose-950">{counts.today}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white text-rose-500 flex items-center justify-center shadow-inner">
            <Calendar className="h-6 w-6" />
          </div>
        </article>

        <article className="rounded-3xl border border-yellow-100 bg-[#fefcf1] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-amber-600">En attente</p>
            <h2 className="text-4xl font-black text-amber-950">{counts.waiting}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white text-amber-500 flex items-center justify-center shadow-inner">
            <Clock className="h-6 w-6" />
          </div>
        </article>

        <article className="rounded-3xl border border-emerald-100 bg-[#f1fef6] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Patients</p>
            <h2 className="text-4xl font-black text-emerald-950">{counts.patients}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white text-emerald-500 flex items-center justify-center shadow-inner">
            <Users className="h-6 w-6" />
          </div>
        </article>

        <article className="rounded-3xl border border-violet-100 bg-[#f5f1fe] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-violet-600">Consultations</p>
            <h2 className="text-4xl font-black text-violet-950">{counts.consultations}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white text-violet-500 flex items-center justify-center shadow-inner">
            <HeartPulse className="h-6 w-6" />
          </div>
        </article>
      </section>

      <section className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-pink-50 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-5.5 w-5.5 text-rose-500" />
            Rendez-vous du jour
          </h3>
          <button
            type="button"
            onClick={onOpenAddAppointment}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs px-4 py-2.5 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Ajouter rendez-vous
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-50/20 text-gray-400 font-extrabold text-[10px] uppercase tracking-wider border-b border-pink-50">
                <th className="py-4 px-6">Heure</th>
                <th className="py-4 px-6">Patient</th>
                <th className="py-4 px-6">Statut</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/50 text-sm font-semibold text-gray-700">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-rose-50/5 transition-all">
                  <td className="py-4 px-6 font-extrabold text-rose-500">{appt.time}</td>
                  <td className="py-4 px-6 font-bold text-gray-900">{appt.patient}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${
                        appt.status === "En attente"
                          ? "bg-rose-500"
                          : appt.status === "Confirmé"
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }`} />
                      <span className={`text-xs font-extrabold ${
                        appt.status === "En attente"
                          ? "text-rose-600"
                          : appt.status === "Confirmé"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}>
                        {appt.status}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {appt.status === "En attente" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onConfirmAppointment(appt.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                            title="Confirmer"
                          >
                            <Check className="h-4 w-4 stroke-[3px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelAppointment(appt.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                            title="Annuler/Décliner"
                          >
                            <X className="h-4 w-4 stroke-[3px]" />
                          </button>
                        </>
                      ) : appt.status === "Confirmé" ? (
                        <button
                          type="button"
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                          title="Consulter dossier complet"
                          onClick={onViewDossier}
                        >
                          <ClipboardList className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                          Annulé
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
