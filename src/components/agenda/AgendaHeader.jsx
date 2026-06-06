// ─── AgendaHeader ──────────────────────────────────────────────────────
// Single Responsibility: rendu du header uniquement
// Interface Segregation: reçoit uniquement les props nécessaires

import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AgendaHeader({ doctorProfile, appointments, availabilities, onRefresh }) {
  const pendingCount = appointments.filter((a) => a.status === "En attente").length;

  return (
    <Card className="rounded-3xl border border-pink-100 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl font-black text-gray-900">Agenda médecin</CardTitle>
          <p className="mt-1 text-sm text-gray-500">
            Vue globale des créneaux, réservations et disponibilités.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={onRefresh} className="rounded-2xl">
            <RefreshCw className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
          <Badge className="rounded-full border-rose-100 bg-rose-50 text-rose-700">
            {appointments.length} rendez-vous
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <DoctorInfo profile={doctorProfile} />
        <AgendaStats pendingCount={pendingCount} slotCount={availabilities.length} />
      </CardContent>
    </Card>
  );
}

function DoctorInfo({ profile }) {
  return (
    <div className="space-y-4 rounded-3xl border border-pink-100 bg-rose-50/70 p-5">
      <p className="text-base font-bold text-gray-900">{profile?.nom ?? "Gynécologue"}</p>
      <p className="text-sm text-gray-600">{profile?.specialty}</p>
      <p className="text-sm text-gray-600">{profile?.email}</p>
    </div>
  );
}

function AgendaStats({ pendingCount, slotCount }) {
  return (
    <div className="grid gap-3">
      <StatCard label="Rendez-vous en attente" value={pendingCount} />
      <StatCard label="Créneaux actifs"         value={slotCount} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
}