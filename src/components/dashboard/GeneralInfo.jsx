import { User, Heart, MapPin, ShieldCheck } from "lucide-react";

export default function GeneralInfo({ dossier, user }) {
  const profile = dossier || user || {};

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-rose-600 mb-5">
        <User className="h-5 w-5" />
        <h3 className="text-xl font-black text-gray-950">Informations générales</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-pink-50 bg-rose-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black">Nom</p>
          <p className="text-sm font-bold text-gray-900">{profile.nom || profile.name || user?.nom || "Patiente"}</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-pink-50 bg-rose-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black">Matricule</p>
          <p className="text-sm font-bold text-gray-900">{profile.matricule || profile.matriculeSociale || "--"}</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-pink-50 bg-rose-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black">Date de naissance</p>
          <p className="text-sm font-bold text-gray-900">{profile.birthday || "Non disponible"}</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-pink-50 bg-rose-50/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black">Adresse</p>
          <p className="text-sm font-bold text-gray-900">{profile.adresse || "Non renseignée"}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Heart className="h-4 w-4 text-rose-500" />
            <span className="text-xs uppercase tracking-[0.2em] font-black">Groupe sanguin</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{profile.bloodType || "--"}</p>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <MapPin className="h-4 w-4 text-rose-500" />
            <span className="text-xs uppercase tracking-[0.2em] font-black">Terme prévu</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{profile.termDate || "--"}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-pink-100 bg-rose-50/10 p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <ShieldCheck className="h-4 w-4 text-rose-500" />
          <span className="text-xs uppercase tracking-[0.2em] font-black">Dernier suivi</span>
        </div>
        <p className="text-sm text-gray-600">{profile.lastDoctor || "Aucun suivi enregistré"}</p>
      </div>
    </div>
  );
}
