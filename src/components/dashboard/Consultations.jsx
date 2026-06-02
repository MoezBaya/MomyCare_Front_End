import { FileText, Calendar } from "lucide-react";

export default function Consultations({ consultations = [], selectedId, onSelect }) {
  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-rose-600 mb-5">
        <Calendar className="h-5 w-5" />
        <div>
          <h3 className="text-xl font-black text-gray-950">Consultations</h3>
          <p className="text-sm text-gray-500">Historique des consultations réalisées et programmées.</p>
        </div>
      </div>

      {consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <button
              key={consultation.id}
              type="button"
              onClick={() => onSelect(consultation.id)}
              className={`w-full rounded-3xl border px-4 py-4 text-left transition-all ${
                consultation.id === selectedId
                  ? "border-rose-200 bg-rose-50 shadow-sm"
                  : "border-pink-50 bg-rose-50/10 hover:border-pink-100"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-gray-900">{consultation.type || "Consultation"}</h4>
                  <p className="text-sm text-gray-500 mt-1">{consultation.date || "Date inconnue"}</p>
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-600">{consultation.status || "Statut"}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{consultation.specialty || "Gynécologie"}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
          Aucune consultation disponible pour ce dossier.
        </div>
      )}
    </div>
  );
}
