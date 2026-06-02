import { FlaskConical, ClipboardList } from "lucide-react";

export default function Analyses({ analyses = [], consultation }) {
  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-rose-600 mb-5">
        <ClipboardList className="h-5 w-5" />
        <div>
          <h3 className="text-xl font-black text-gray-950">Analyses</h3>
          <p className="text-sm text-gray-500">Résultats et notes pour la consultation sélectionnée.</p>
        </div>
      </div>

      {analyses.length > 0 ? (
        <div className="grid gap-4">
          {analyses.map((item) => (
            <article key={item.id || item.type || item.nom} className="rounded-3xl border border-pink-50 bg-rose-50/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-gray-900">{item.nom || item.type || "Analyse"}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.date || item.createdAt || "Date non renseignée"}</p>
                </div>
                <FlaskConical className="h-5 w-5 text-rose-500" />
              </div>
              <p className="mt-3 text-sm text-gray-600">{item.resultat || item.result || item.description || "Aucun détail disponible."}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
          Aucune analyse disponible pour cette consultation.
        </div>
      )}
    </div>
  );
}
