import { useMemo, useState } from "react";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const JOURS = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
  { value: "SUNDAY", label: "Dimanche" },
];

export default function DisponibilitesView({
  availabilities = [],
  onAddAvailability,
  onDeleteAvailability,
  isLoading = false,
}) {
  const [jourSemaine, setJourSemaine] = useState("MONDAY");
  const [heureDebut, setHeureDebut] = useState("09:00");
  const [heureFin, setHeureFin] = useState("12:00");
  const [status, setStatus] = useState("");

  const nextSlot = useMemo(() => availabilities[0] || null, [availabilities]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    if (!jourSemaine || !heureDebut || !heureFin) {
      setStatus("Veuillez remplir tous les champs.");
      return;
    }

    const created = await onAddAvailability(jourSemaine, heureDebut, heureFin);
    if (created) {
      setStatus("Plage horaire ajoutée avec succès.");
      setJourSemaine("MONDAY");
      setHeureDebut("09:00");
      setHeureFin("12:00");
    } else {
      setStatus("Impossible d'ajouter la plage. Réessayez.");
    }
  };

  return (
    <Card className="animate-fade-in border-pink-100 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-pink-50 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-2xl font-black text-gray-950">
            <Calendar className="h-6.5 w-6.5 text-rose-500" />
            Gestion des disponibilités (récurrentes)
          </CardTitle>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Définissez vos plages horaires hebdomadaires pour les patientes.
          </p>
        </div>
        {nextSlot && (
          <div className="rounded-3xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Prochaine plage</p>
            <p>{nextSlot.label}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Jour</label>
            <select
              value={jourSemaine}
              onChange={(e) => setJourSemaine(e.target.value)}
              className="h-11 w-full rounded-xl border border-pink-100 bg-white px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {JOURS.map((jour) => (
                <option key={jour.value} value={jour.value}>
                  {jour.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Heure début</label>
            <Input
              type="time"
              step="60"
              value={heureDebut}
              onChange={(e) => setHeureDebut(e.target.value)}
              className="h-11 rounded-xl border-pink-100 bg-white px-3.5"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Heure fin</label>
            <Input
              type="time"
              step="60"
              value={heureFin}
              onChange={(e) => setHeureFin(e.target.value)}
              className="h-11 rounded-xl border-pink-100 bg-white px-3.5"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="h-11 w-full rounded-2xl bg-rose-500 text-white hover:bg-rose-600">
              <Plus className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          </div>
        </form>

        {status && (
          <p className={`text-sm ${status.includes("succès") ? "text-emerald-600" : "text-rose-600"}`}>
            {status}
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-gray-900">Plages actives</h3>
              <p className="text-sm text-gray-500">{availabilities.length} plage{availabilities.length > 1 ? "s" : ""}</p>
            </div>
            <Badge variant="outline" className="rounded-full border-rose-100 bg-rose-50 text-rose-600">
              {isLoading ? "Chargement..." : "À jour"}
            </Badge>
          </div>

          {availabilities.length === 0 ? (
            <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
              Aucune plage de disponibilité définie.
            </div>
          ) : (
            <div className="space-y-3">
              {availabilities.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-3xl border border-pink-100 bg-white px-4 py-4 shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{slot.label}</p>
                    <p className="text-xs text-gray-500">
                      {slot.jourLibelle} — {slot.heureDebut} à {slot.heureFin}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => onDeleteAvailability(slot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}