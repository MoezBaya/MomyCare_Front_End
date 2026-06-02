import { Image, Camera, Film } from "lucide-react";

export default function Imageries({ imageries = [], consultation }) {
  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-rose-600 mb-5">
        <Image className="h-5 w-5" />
        <div>
          <h3 className="text-xl font-black text-gray-950">Imageries</h3>
          <p className="text-sm text-gray-500">Échographies, radiographies et examens liés à cette consultation.</p>
        </div>
      </div>

      {imageries.length > 0 ? (
        <div className="grid gap-4">
          {imageries.map((item) => (
            <article key={item.id || item.type || item.nom} className="rounded-3xl border border-pink-50 bg-rose-50/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-gray-900">{item.nom || item.type || "Imagerie"}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.date || item.createdAt || "Date non renseignée"}</p>
                </div>
                <Camera className="h-5 w-5 text-rose-500" />
              </div>
              <p className="mt-3 text-sm text-gray-600">{item.description || item.rapport || "Aucun détail disponible."}</p>
              {item.lien && (
                <a href={item.lien} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <Film className="h-4 w-4" />
                  Voir le document
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
          Aucune imagerie disponible pour cette consultation.
        </div>
      )}
    </div>
  );
}
