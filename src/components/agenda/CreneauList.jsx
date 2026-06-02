import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CreneauList({
  slots = [],
  selectedSlotId,
  onSelectSlot,
  emptyLabel = "Aucun créneau disponible pour le moment.",
}) {
  return (
    <Card className="rounded-3xl border border-pink-100 bg-white shadow-sm">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-rose-500" />
          <div>
            <p className="text-sm font-bold text-gray-900">Créneaux disponibles</p>
            <p className="text-xs text-gray-500">Choisissez le meilleur créneau pour la patiente.</p>
          </div>
        </div>

        {slots.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-pink-200 bg-rose-50/50 p-4 text-center text-sm text-gray-500">
            {emptyLabel}
          </div>
        ) : (
          <div className="grid gap-3">
            {slots.map((slot) => (
              <Button
                key={slot.id}
                type="button"
                variant={String(slot.id) === String(selectedSlotId) ? "secondary" : "outline"}
                onClick={() => onSelectSlot(slot)}
                className="justify-between rounded-3xl px-4 py-3 text-sm font-semibold"
              >
                <span className="flex items-center gap-2 text-left">
                  <Clock className="h-4 w-4 text-rose-500" />
                  <span>{slot.label}</span>
                </span>
                {String(slot.id) === String(selectedSlotId) ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                ) : null}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
