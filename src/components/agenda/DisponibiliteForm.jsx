import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const availabilitySchema = z.object({
  jourSemaine: z.string().min(1, "Sélectionnez un jour."),
  heureDebut: z.string().min(1, "Heure début requise."),
  heureFin: z.string().min(1, "Heure fin requise."),
});

const JOURS = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
  { value: "SUNDAY", label: "Dimanche" },
];

export function DisponibiliteForm({ onAddAvailability, loading = false }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      jourSemaine: "MONDAY",
      heureDebut: "09:00",
      heureFin: "12:00",
    },
  });

  const onSubmit = async (data) => {
    const created = await onAddAvailability(data.jourSemaine, data.heureDebut, data.heureFin);
    if (created) {
      reset({ jourSemaine: "MONDAY", heureDebut: "09:00", heureFin: "12:00" });
    }
  };

  return (
    <Card className="rounded-3xl border border-pink-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">Ajouter une plage de disponibilité (récurrente)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <div className="space-y-1">
            <Label htmlFor="jourSemaine">Jour de la semaine</Label>
            <select
              id="jourSemaine"
              {...register("jourSemaine")}
              className="h-11 w-full rounded-xl border border-pink-100 bg-white px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {JOURS.map((jour) => (
                <option key={jour.value} value={jour.value}>
                  {jour.label}
                </option>
              ))}
            </select>
            {errors.jourSemaine && <p className="text-xs text-rose-600">{errors.jourSemaine.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="heureDebut">Heure début</Label>
            <Input
              id="heureDebut"
              type="time"
              step="60"
              {...register("heureDebut")}
              className="h-11 rounded-xl border-pink-100 bg-white px-3.5"
            />
            {errors.heureDebut && <p className="text-xs text-rose-600">{errors.heureDebut.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="heureFin">Heure fin</Label>
            <Input
              id="heureFin"
              type="time"
              step="60"
              {...register("heureFin")}
              className="h-11 rounded-xl border-pink-100 bg-white px-3.5"
            />
            {errors.heureFin && <p className="text-xs text-rose-600">{errors.heureFin.message}</p>}
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="h-11 rounded-3xl bg-rose-500 text-white hover:bg-rose-600"
            >
              {isSubmitting || loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
        <p className="text-xs text-gray-500">
          ⚠️ Cette disponibilité sera récurrente chaque semaine (ex: tous les lundis de 9h à 12h).
        </p>
      </CardContent>
    </Card>
  );
}