import { useMemo, useState } from "react";
import { Calendar, Check, ClipboardList } from "lucide-react";
import { requestRdv } from "@/services/appointmentService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

// ✅ Aligné exactement sur l'enum MotifRendezVous du backend
const MOTIFS = [
  { value: "CONSULTATION",    label: "Consultation" },
  { value: "ECHOGRAPHIE",     label: "Échographie" },
  { value: "PROBLEME_MEDICAL", label: "Problème médical" },
  { value: "GROSSESSE_RISQUE", label: "Grossesse à risque" },
];

export default function DemandeRdv({ doctors = [], defaultDoctor, onSuccess, onCancel }) {
  const [selectedDoctor, setSelectedDoctor] = useState(
    defaultDoctor ? String(defaultDoctor) : doctors[0]?.id ? String(doctors[0].id) : ""
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [motif, setMotif] = useState("CONSULTATION");
  // ✅ SUPPRIMÉ : duree et notes ne sont pas dans le RendezVousRequestDTO backend
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDoctorInfo = useMemo(
    () => doctors.find((d) => String(d.id) === String(selectedDoctor)) || null,
    [doctors, selectedDoctor]
  );

  const selectedDoctorLabel = useMemo(
    () => selectedDoctorInfo?.name || String(selectedDoctor),
    [selectedDoctorInfo, selectedDoctor]
  );

  const selectedDateTime = useMemo(() => {
    if (!selectedSlot?.dateTime) {
      return { date: "", time: "" };
    }
    const [slotDate, slotTime] = String(selectedSlot.dateTime).split("T");
    return {
      date: slotDate || "",
      time: slotTime ? slotTime.slice(0, 5) : "",
    };
  }, [selectedSlot]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedSlot || !motif) {
      setStatus("Veuillez sélectionner un créneau et renseigner le motif.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      // ✅ Payload exact aligné sur RendezVousRequestDTO :
      // { gynecologueId: Long, dateRendezVous: LocalDateTime (ISO), motif: MotifRendezVous }
      const saved = await requestRdv({
        gynecologueId: Number(selectedDoctor),
        dateRendezVous: `${selectedDateTime.date}T${selectedDateTime.time}:00`,
        motif,
      });

      setStatus("✓ Demande envoyée avec succès ! Le gynécologue recevra votre proposition.");

      if (onSuccess) {
        onSuccess({
          id: saved?.id || Date.now(),
          doctor: selectedDoctorLabel,
          gynecologueId: Number(selectedDoctor),
          date: new Date(selectedDateTime.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: selectedDateTime.time,
          // ✅ statusRDV backend → "En attente" (EN_ATTENTE)
          status: "En attente",
          type: MOTIFS.find((m) => m.value === motif)?.label || motif,
        });
      }

      setTimeout(() => {
        setSelectedSlot(null);
        setMotif("CONSULTATION");
      }, 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error;
      setStatus(msg || "Impossible d'envoyer la demande. Réessayez plus tard.");
      console.error("[DemandeRdv] Erreur :", err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl rounded-[2rem] border border-border bg-card shadow-lg shadow-pink-200/20">
      <CardHeader className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 px-6 py-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-white/20 text-white shadow-sm">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black text-white">Demande de rendez-vous</CardTitle>
            <CardDescription className="text-sm text-white/80">
              Choisissez un gynécologue et un créneau puis envoyez votre demande.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6 pt-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Sélection gynécologue */}
          <div className="space-y-2">
            <Label htmlFor="doctor-select">Gynécologue</Label>
            <Select
              id="doctor-select"
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setSelectedSlot(null);
              }}
            >
              {doctors.length === 0 && (
                <SelectItem value="">Aucun gynécologue disponible</SelectItem>
              )}
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name} — {doctor.specialty}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Info gynécologue */}
          {selectedDoctorInfo ? (
            <div className="rounded-3xl border border-pink-100 bg-white/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Gynécologue sélectionné</p>
              <p className="mt-1 text-base font-semibold text-foreground">{selectedDoctorInfo.name}</p>
              <p className="text-sm text-muted-foreground">{selectedDoctorInfo.specialty}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedDoctorInfo.availabilitySlots?.length > 0
                  ? `${selectedDoctorInfo.availabilitySlots.length} créneau(x) disponible(s)`
                  : "Aucune disponibilité connue"}
              </p>
            </div>
          ) : null}

          {/* Créneaux disponibles — depuis GET /api/disponibilites/gyneco/{id} */}
          {selectedDoctorInfo?.availabilitySlots?.length > 0 ? (
            <div className="space-y-3">
              <Label>Créneaux disponibles</Label>
              <div className="grid gap-3 max-h-56 overflow-y-auto">
                {selectedDoctorInfo.availabilitySlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={selectedSlot?.id === slot.id ? "secondary" : "outline"}
                    className="justify-start gap-3 rounded-3xl px-4 py-3 text-left"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <Calendar className="h-4 w-4 text-rose-500" />
                    <span className="flex-1 text-sm font-semibold text-foreground">
                      {slot.label}
                    </span>
                    {selectedSlot?.id === slot.id ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : null}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-background p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Aucun créneau disponible</p>
              <p className="mt-1">Veuillez choisir un autre gynécologue ou contacter le cabinet.</p>
            </div>
          )}

          {/* Créneau sélectionné */}
          {selectedSlot ? (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-foreground">
              <p className="font-semibold text-emerald-800">Créneau sélectionné</p>
              <p className="mt-1 text-sm text-foreground">{selectedSlot.label}</p>
            </div>
          ) : null}

          {/* Motif — ✅ seul champ requis avec gynecologueId et dateRendezVous */}
          <div className="space-y-2">
            <Label htmlFor="motif-select">Motif de la consultation</Label>
            <Select
              id="motif-select"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
            >
              {MOTIFS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Message de statut */}
          {status ? (
            <div className="rounded-3xl border px-4 py-3 text-sm font-semibold text-foreground">
              <p className={status.includes("succès") ? "text-emerald-700" : "text-destructive"}>{status}</p>
            </div>
          ) : null}

          {/* Actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="submit"
              disabled={isSubmitting || doctors.length === 0 || !selectedSlot}
              className="rounded-3xl px-4 py-3 text-sm font-semibold"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="rounded-3xl px-4 py-3 text-sm font-semibold"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
