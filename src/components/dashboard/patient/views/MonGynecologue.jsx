// src/components/dashboard/patient/views/MonGynecologue.jsx
import { useEffect, useState } from "react";
import { Loader2, Star, MapPin, Phone, Mail, Calendar, RefreshCw } from "lucide-react";
import api from "@/services/api";

export default function MonGynecologue() {
  const [gyneco, setGyneco] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGynecologue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/relations/mon-gynecologue");
      const data = res.data?.body ?? res.data?.data ?? res.data;
      setGyneco(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("AUCUN_GYNECO");
      } else {
        setError("ERREUR_RESEAU");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGynecologue();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (error === "AUCUN_GYNECO") {
    return (
      <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-8 text-center">
        <div className="space-y-4">
          <div className="text-rose-600 text-6xl">👩‍⚕️</div>
          <h3 className="text-xl font-bold text-gray-800">Aucun gynécologue attitré</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Vous n’êtes pas encore associée à un gynécologue. Prenez rendez‑vous avec un praticien pour créer votre suivi médical.
          </p>
          <button
            onClick={() => window.location.href = "/recherche-gyneco"}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-6 py-3 text-white font-semibold hover:bg-rose-600 transition"
          >
            <Calendar className="h-4 w-4" />
            Trouver un gynécologue
          </button>
        </div>
      </div>
    );
  }

  if (error || !gyneco) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/10 p-8 text-center">
        <p className="text-red-600">Impossible de charger votre gynécologue. Veuillez réessayer.</p>
        <button onClick={fetchGynecologue} className="mt-4 text-rose-500 underline">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3 text-rose-600">
          <Star className="h-5 w-5" />
          <div>
            <h3 className="text-xl font-black text-gray-950">Mon gynécologue</h3>
            <p className="text-sm text-gray-500">Votre praticien attitré</p>
          </div>
        </div>
        <button
          onClick={fetchGynecologue}
          className="p-2 rounded-full hover:bg-rose-50 transition"
          title="Rafraîchir"
        >
          <RefreshCw className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-black text-gray-900">
            Dr. {gyneco.prenom || ""} {gyneco.nom || ""}
          </h4>
          <p className="text-sm text-gray-500">{gyneco.specialty || "Gynécologue obstétricien"}</p>
        </div>

        <div className="grid gap-3 text-sm text-gray-600">
          {gyneco.adresse && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500" />
              <span>{gyneco.adresse}</span>
            </div>
          )}
          {gyneco.numeroTelephone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-rose-500" />
              <span>{gyneco.numeroTelephone}</span>
            </div>
          )}
          {gyneco.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-rose-500" />
              <span>{gyneco.email}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => window.location.href = `/prendre-rendez-vous?gynecoId=${gyneco.id}`}
          className="mt-4 w-full rounded-2xl bg-rose-500 py-3 text-sm font-bold text-white hover:bg-rose-600 transition flex items-center justify-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Prendre rendez-vous
        </button>
      </div>
    </div>
  );
}