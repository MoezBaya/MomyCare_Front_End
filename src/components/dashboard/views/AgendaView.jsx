// src/components/dashboard/views/AgendaView.jsx
import { useMemo, useState } from "react";
import { Calendar, Clock, RefreshCw, Plus, Sparkles } from "lucide-react";
import { AgendaCalendar } from "@/components/agenda/AgendaCalendar";
import { DisponibiliteForm } from "@/components/agenda/DisponibiliteForm";
import { RendezVousCard } from "@/components/agenda/RendezVousCard";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastViewport } from "@/components/ui/toast";

export default function AgendaView() {
  const {
    doctorProfile,
    allAppointments = [],
    availabilities = [],
    isLoadingData,
    handleAddAvailability,
    handleDeleteAvailability,
    refreshAllAppointments,
  } = useDoctorDashboard();

  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Transformation des RDV en événements FullCalendar
  const events = useMemo(() => {
    if (!allAppointments.length) return [];
    return allAppointments.map((rdv) => ({
      id: rdv.id,
      title: `${rdv.patient} – ${rdv.type}`,
      start: rdv.dateRendezVous, // doit être une chaîne ISO
      allDay: false,
      extendedProps: { ...rdv },
      color: rdv.status === "Confirmé" ? "#10b981" : "#f59e0b",
    }));
  }, [allAppointments]);

  const handleEventSelection = (info) => {
    setSelectedEvent(info.event);
  };

  const refreshAgenda = () => {
    refreshAllAppointments();
  };

  if (isLoadingData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-pink-100 bg-white/80 p-12 shadow-sm">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">Chargement de l'agenda médical...</p>
          <p className="mt-2 text-sm">Un instant, nous récupérons les rendez-vous et créneaux disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <Card className="rounded-3xl border border-pink-100 shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-gray-900">Agenda médecin</CardTitle>
              <p className="mt-1 text-sm text-gray-500">Vue globale des créneaux, réservations et disponibilités.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={refreshAgenda} className="rounded-2xl">
                <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
              </Button>
              <Badge className="rounded-full border-rose-100 bg-rose-50 text-rose-700">
                {allAppointments.length} rendez-vous
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-pink-100 bg-rose-50/70 p-5">
              <div className="flex items-center gap-3 text-rose-700">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-semibold">Médecin connecté</span>
              </div>
              <p className="text-base font-bold text-gray-900">{doctorProfile?.nom || "Gynécologue"}</p>
              <p className="text-sm text-gray-600">{doctorProfile?.specialty}</p>
              <p className="text-sm text-gray-600">{doctorProfile?.email}</p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-3xl border border-rose-100 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Rendez-vous en attente</p>
                <p className="mt-3 text-3xl font-black text-gray-900">
                  {allAppointments.filter((item) => item.status === "En attente").length}
                </p>
              </div>
              <div className="rounded-3xl border border-rose-100 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Créneaux actifs</p>
                <p className="mt-3 text-3xl font-black text-gray-900">{availabilities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="rounded-3xl border border-pink-100 bg-white p-1 shadow-sm">
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="availability">Disponibilités</TabsTrigger>
          <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <AgendaCalendar events={events} onEventClick={handleEventSelection} />
          {selectedEvent ? (
            <Card className="rounded-3xl border border-pink-100 bg-white shadow-sm">
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  <span>Événement sélectionné</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{selectedEvent?.title}</p>
                <p className="text-sm text-gray-600">Statut : {selectedEvent?.extendedProps?.status}</p>
                <p className="text-sm text-gray-600">Date : {selectedEvent?.extendedProps?.date}</p>
                <p className="text-sm text-gray-600">Heure : {selectedEvent?.extendedProps?.time}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-3xl border border-dashed border-pink-100 bg-rose-50/80 p-6 text-center text-sm text-gray-500">
              Cliquez sur un événement dans le calendrier pour voir le détail.
            </div>
          )}
        </TabsContent>

        <TabsContent value="availability" className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-6">
            <DisponibiliteForm onAddAvailability={handleAddAvailability} loading={false} />
          </div>
          <div className="space-y-4">
            <Card className="rounded-3xl border border-pink-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Liste des créneaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availabilities.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-pink-200 bg-rose-50/70 p-6 text-center text-sm text-gray-500">
                    Aucun créneau disponible. Ajoutez-en un pour le rendre visible aux patientes.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availabilities.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between rounded-3xl border border-pink-100 bg-rose-50/80 px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{slot.label}</p>
                          <p className="text-xs text-gray-500">{slot.date} • {slot.time}</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => handleDeleteAvailability(slot.id)}>
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          {allAppointments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-pink-200 bg-rose-50/70 p-10 text-center text-sm text-gray-500">
              Aucun rendez-vous n'est encore enregistré.
            </div>
          ) : (
            <div className="grid gap-4">
              {allAppointments.map((appointment) => (
                <RendezVousCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ToastViewport toasts={[]} onDismiss={() => {}} />
    </div>
  );
}