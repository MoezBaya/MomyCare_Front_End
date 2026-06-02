import { FileText, Phone, Mail, Heart } from "lucide-react";

export default function GynecoPatients({ patients = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-gray-950">Patientes suivies</h3>
          <p className="text-sm text-gray-500">Consultez la liste des patientes sous votre suivi obstétrique.</p>
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">{patients.length} patientes</span>
      </div>

      <div className="grid gap-4">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <article key={patient.id} className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-gray-900">{patient.name}</h4>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-[0.2em]">{patient.progress}</p>
                </div>
                <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">Dossier actif</span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-rose-500" />
                  <span>{patient.phone || "--"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-rose-500" />
                  <span>{patient.email || "--"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>Terme prévu : {patient.termDate || "--"}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-2xl border border-rose-100 bg-rose-50/80 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all"
              >
                Consulter dossier
              </button>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
            Aucune patiente trouvée pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
