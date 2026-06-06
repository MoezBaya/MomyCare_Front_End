// ─── AvailabilityTab ───────────────────────────────────────────────────
// Single Responsibility: onglet "Disponibilités" uniquement
// Dependency Inversion: reçoit des callbacks, pas le hook directement

import { DisponibiliteForm } from "@/components/agenda/DisponibiliteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AvailabilityTab({ availabilities, onAdd, onDelete }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <DisponibiliteForm onAddAvailability={onAdd} loading={false} />
      <AvailabilityList availabilities={availabilities} onDelete={onDelete} />
    </div>
  );
}

function AvailabilityList({ availabilities, onDelete }) {
  return (
    <Card className="rounded-3xl border border-pink-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">Liste des créneaux</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availabilities.length === 0 ? (
          <EmptySlots />
        ) : (
          <div className="space-y-3">
            {availabilities.map((slot) => (
              <SlotRow key={slot.id} slot={slot} onDelete={onDelete} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SlotRow({ slot, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-pink-100 bg-rose-50/80 px-4 py-4">
      <div>
        <p className="font-semibold text-gray-900">{slot.label}</p>
        <p className="text-xs text-gray-500">{slot.date} • {slot.time}</p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => onDelete(slot.id)}>
        Supprimer
      </Button>
    </div>
  );
}

function EmptySlots() {
  return (
    <div className="rounded-3xl border border-dashed border-pink-200 bg-rose-50/70 p-6 text-center text-sm text-gray-500">
      Aucun créneau disponible. Ajoutez-en un pour le rendre visible aux patientes.
    </div>
  );
}