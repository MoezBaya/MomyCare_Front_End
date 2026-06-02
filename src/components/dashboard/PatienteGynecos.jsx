import { Search, Star, MapPin } from "lucide-react";

export default function PatienteGynecos({ doctors = [], onSelectDoctor = () => {} }) {
  return (
    <div className="space-y-4">
      {doctors.length > 0 ? (
        doctors.map((doctor) => (
          <article key={doctor.id || doctor.name} className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-base font-black text-gray-900">{doctor.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{doctor.specialty}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
                {doctor.availability || "Disponible"}
                {doctor.availabilitySlots?.length > 1 ? ` (+${doctor.availabilitySlots.length - 1})` : ""}
              </span>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>{doctor.hospital || "Adresse non renseignée"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-rose-500" />
                <span>{doctor.rating || "Note non disponible"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectDoctor(doctor)}
              className="mt-5 w-full rounded-2xl bg-rose-500 py-3 text-sm font-bold text-white hover:bg-rose-600 transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                Choisir ce gynécologue
              </span>
            </button>
          </article>
        ))
      ) : (
        <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
          Aucun gynécologue trouvé.
        </div>
      )}
    </div>
  );
}
