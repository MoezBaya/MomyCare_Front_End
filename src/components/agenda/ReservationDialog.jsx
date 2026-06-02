import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/services/api";
import { fetchCreneauxForDay } from "@/services/disponibiliteService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";

const MOTIFS = [
  { value: "CONSULTATION", label: "Consultation" },
  { value: "ECHOGRAPHIE", label: "Échographie" },
  { value: "PROBLEME_MEDICAL", label: "Problème médical" },
  { value: "GROSSESSE_RISQUE", label: "Grossesse à risque" },
];

const bookingSchema = z.object({
  gynecologueId: z.string().min(1, "Sélectionnez un gynécologue."),
  date: z.string().min(1, "Sélectionnez une date."),
  slotId: z.string().min(1, "Sélectionnez un créneau."),
  motif: z.string().min(1, "Choisissez un motif."),
});

export function ReservationDialog({ doctors = [], defaultDoctor, onSuccess, onCancel }) {
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      gynecologueId: defaultDoctor ? String(defaultDoctor) : (doctors[0]?.id ? String(doctors[0].id) : ""),
      date: new Date().toISOString().slice(0, 10),
      slotId: "",
      motif: "CONSULTATION",
    },
  });

  const selectedDoctorId = watch("gynecologueId");
  const selectedDate = watch("date");
  const selectedSlotId = watch("slotId");

  const selectedDoctor = useMemo(
    () => doctors.find((d) => String(d.id) === selectedDoctorId) || null,
    [doctors, selectedDoctorId]
  );

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setAvailableSlots([]);
      return;
    }
    setIsLoadingSlots(true);
    fetchCreneauxForDay(selectedDoctor.id, selectedDate, true)
      .then((slots) => {
        setAvailableSlots(slots);
        setValue("slotId", "");
      })
      .catch((err) => {
        console.error("[ReservationDialog] Erreur chargement créneaux :", err);
        setAvailableSlots([]);
        notify("Impossible de charger les créneaux pour cette date.", "error");
      })
      .finally(() => setIsLoadingSlots(false));
  }, [selectedDoctor, selectedDate, setValue, notify]);

  const onSubmit = async (data) => {
    if (!selectedDoctor) {
      notify("Veuillez sélectionner un gynécologue.", "error");
      return;
    }

    const selectedSlot = availableSlots.find((slot) => slot.id === data.slotId);
    if (!selectedSlot) {
      notify("Veuillez sélectionner un créneau horaire.", "error");
      return;
    }

    const slotDate = new Date(selectedSlot.start);
    const now = new Date();
    if (slotDate.getTime() - now.getTime() < 60000) {
      notify("Ce créneau n'est plus disponible (doit être dans le futur).", "error");
      return;
    }

    const gynecologueId = Number(selectedDoctor.id);
    if (isNaN(gynecologueId) || gynecologueId <= 0) {
      console.error("[ReservationDialog] ID gynécologue invalide :", selectedDoctor.id);
      notify("Identifiant du médecin invalide. Contactez le support.", "error");
      return;
    }

    // ✅ CORRECTION : reconstruire la date/heure locale sans timezone
    const year = slotDate.getFullYear();
    const month = String(slotDate.getMonth() + 1).padStart(2, '0');
    const day = String(slotDate.getDate()).padStart(2, '0');
    const hours = String(slotDate.getHours()).padStart(2, '0');
    const minutes = String(slotDate.getMinutes()).padStart(2, '0');
    const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00`;

    const payload = {
      gynecologueId,
      dateRendezVous: localDateTimeString,
      motif: data.motif,
    };

    console.debug("[ReservationDialog] Payload envoyé :", JSON.stringify(payload, null, 2));

    setIsSubmitting(true);
    try {
      const response = await api.post("/api/rdv", payload);
      const newRdv = response.data?.body ?? response.data?.data ?? response.data;

      const motifLabel = MOTIFS.find((m) => m.value === data.motif)?.label || data.motif;
      const formattedDate = slotDate.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = slotDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

      onSuccess?.({
        id: newRdv?.id,
        doctor: selectedDoctor.name,
        gynecologueId: selectedDoctor.id,
        date: formattedDate,
        time: formattedTime,
        status: "En attente",
        type: motifLabel,
      });

      notify("✅ Demande de rendez-vous envoyée avec succès.", "success");
      onCancel?.();
    } catch (err) {
      console.error("[ReservationDialog] Erreur API :", err.response?.status, err.response?.data);
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Erreur lors de la réservation. Veuillez réessayer.";
      notify(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl rounded-[2rem] border border-border bg-card shadow-2xl shadow-pink-200/20">
      <Card className="rounded-[2rem] border-0 shadow-none">
        <CardHeader className="rounded-t-[2rem] bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 px-8 py-7 text-white">
          <CardTitle className="text-3xl font-black">Prenez rendez-vous</CardTitle>
          <CardDescription className="max-w-2xl text-sm text-white/80">
            Sélectionnez un gynécologue, une date, un créneau et validez.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="gynecologueId">Gynécologue</Label>
              <Select id="gynecologueId" {...register("gynecologueId")}>
                <SelectItem value="">Choisir un gynécologue</SelectItem>
                {doctors.map((doc) => (
                  <SelectItem key={doc.id} value={String(doc.id)}>
                    {doc.name} — {doc.specialty}
                  </SelectItem>
                ))}
              </Select>
              {errors.gynecologueId && <p className="text-xs text-rose-600">{errors.gynecologueId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date du rendez-vous</Label>
              <input
                type="date"
                id="date"
                {...register("date")}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              {errors.date && <p className="text-xs text-rose-600">{errors.date.message}</p>}
            </div>

            <div className="space-y-3">
              <Label>Créneaux disponibles</Label>
              {isLoadingSlots && <p className="text-sm text-gray-500">Chargement des créneaux...</p>}
              {!isLoadingSlots && availableSlots.length === 0 && selectedDoctor && (
                <p className="text-sm text-amber-600">Aucun créneau disponible pour cette date.</p>
              )}
              {!isLoadingSlots && availableSlots.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setValue("slotId", slot.id)}
                      className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                        selectedSlotId === slot.id
                          ? "border-rose-500 bg-rose-100 text-rose-700"
                          : "border-gray-200 bg-white hover:border-rose-300 hover:bg-rose-50"
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
              {errors.slotId && <p className="text-xs text-rose-600">{errors.slotId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motif">Motif</Label>
              <Select id="motif" {...register("motif")}>
                {MOTIFS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
              {errors.motif && <p className="text-xs text-rose-600">{errors.motif.message}</p>}
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                type="submit"
                disabled={isSubmitting || isLoadingSlots}
                className="flex-1 rounded-3xl bg-rose-500 text-white hover:bg-rose-600"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 rounded-3xl border-pink-200 text-rose-600 hover:bg-rose-50"
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}