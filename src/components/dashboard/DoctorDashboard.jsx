import { useState } from "react";
import { Plus } from "lucide-react";
import DoctorSidebar from "@/components/dashboard/DoctorSidebar";
import DoctorHeader from "@/components/dashboard/DoctorHeader";
import DoctorHomeView from "@/components/dashboard/views/DoctorHomeView";
import RendezVousView from "@/components/dashboard/views/RendezVousView";
import AgendaView from "@/components/dashboard/views/AgendaView";
import DisponibilitesView from "@/components/dashboard/views/DisponibilitesView";
import PatientsView from "@/components/dashboard/views/PatientsView";
import DossiersView from "@/components/dashboard/views/DossiersView";
import ExamensView from "@/components/dashboard/views/ExamensView";
import PrescriptionsView from "@/components/dashboard/views/PrescriptionsView";
import ParametresView from "@/components/dashboard/views/ParametresView";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";
import { DashboardProvider } from "@/context/DashboardContext";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DoctorDashboard({ user, onLogout }) {
  const dashboard = useDoctorDashboard(user);
  const {
    activeSidebar,
    setActiveSidebar,
    activeHeaderTab,
    setActiveHeaderTab,
    showAddApptModal,
    setShowAddApptModal,
    showNotifications,
    setShowNotifications,
    notifications,
    doctorProfile,
    isLoadingData,
    isRefreshingRdv,
    counts,
    appointmentsState,
    patientsState,
    prescriptionsState,
    addAppointmentWithPatient,
    refreshAppointments,
  } = dashboard;

  const { appointments, handleConfirmAppointment, handleCancelAppointment } = appointmentsState;
  const { patients } = patientsState;
  const { prescriptions, handleSavePrescription } = prescriptionsState;
  const { availabilities, handleAddAvailability, handleDeleteAvailability } = dashboard;

  const [newPatientName, setNewPatientName] = useState("");
  const [newTime, setNewTime] = useState("11:30");

  const docName = doctorProfile.nom;

  const handleAddAppointmentSubmit = (event) => {
    event.preventDefault();
    if (!newPatientName.trim()) return;
    addAppointmentWithPatient({ patientName: newPatientName, time: newTime });
    setNewPatientName("");
    setNewTime("11:30");
    setShowAddApptModal(false);
    setActiveSidebar("rdv");
  };

  return (
    <DashboardProvider value={dashboard}>
      <div className="flex h-screen bg-[#faf7f9] overflow-hidden font-sans antialiased text-gray-800">
        <DoctorSidebar
          activeSidebar={activeSidebar}
          onSelectSidebar={setActiveSidebar}
          onLogout={onLogout}
          counts={counts}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DoctorHeader
            activeHeaderTab={activeHeaderTab}
            activeSidebar={activeSidebar}
            setActiveHeaderTab={setActiveHeaderTab}
            setActiveSidebar={setActiveSidebar}
            onLogout={onLogout}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notifications={notifications}
            docName={docName}
          />

          <main className="flex-1 overflow-y-auto p-8 space-y-8">
            {isLoadingData && (
              <p className="text-xs font-semibold text-rose-500">Chargement des données...</p>
            )}

            {activeSidebar === "accueil" && activeHeaderTab === "tableau" && (
              <DoctorHomeView
                docName={docName}
                counts={counts}
                appointments={appointments}
                onConfirmAppointment={handleConfirmAppointment}
                onCancelAppointment={handleCancelAppointment}
                onOpenAddAppointment={() => setShowAddApptModal(true)}
                onViewDossier={() => setActiveSidebar("dossiers")}
              />
            )}

            {/* ✅ Ajout de onRefresh et isRefreshing pour sync backend */}
            {activeSidebar === "agenda" && <AgendaView />}

            {activeSidebar === "rdv" && (
              <RendezVousView
                appointments={appointments}
                onConfirmAppointment={handleConfirmAppointment}
                onCancelAppointment={handleCancelAppointment}
                onOpenAddAppointment={() => setShowAddApptModal(true)}
                onRefresh={refreshAppointments}
                isRefreshing={isRefreshingRdv}
              />
            )}

            {activeSidebar === "patients" && <PatientsView patients={patients} />}

            {activeSidebar === "disponibilites" && (
              <DisponibilitesView
                availabilities={availabilities}
                onAddAvailability={handleAddAvailability}
                onDeleteAvailability={handleDeleteAvailability}
                isLoading={isLoadingData}
              />
            )}

            {activeSidebar === "dossiers" && <DossiersView patients={patients} />}

            {activeSidebar === "examens" && <ExamensView patients={patients} />}

            {activeSidebar === "medicaments" && (
              <PrescriptionsView
                prescriptions={prescriptions}
                patients={patients}
                onSavePrescription={handleSavePrescription}
              />
            )}

            {(activeSidebar === "parametres" || activeHeaderTab === "profil") && (
              <ParametresView doctorProfile={doctorProfile} />
            )}
          </main>
        </div>

        <Dialog open={showAddApptModal} onOpenChange={setShowAddApptModal}>
          <DialogContent className="max-w-md space-y-4">
            <DialogClose />
            <DialogHeader className="border-b border-pink-50 pb-3">
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-rose-500" />
                Ajouter un rendez-vous
              </DialogTitle>
              <DialogDescription>
                Planifiez une consultation dans le planning du jour.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddAppointmentSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="new-patient-name">Nom de la patiente</Label>
                <Input
                  id="new-patient-name"
                  type="text"
                  required
                  placeholder="Ex : Fatma Ben Youssef"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="h-11 rounded-xl border-pink-100 bg-white px-3.5 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="new-appointment-time">Heure du rendez-vous</Label>
                <Input
                  id="new-appointment-time"
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="h-11 rounded-xl border-pink-100 bg-white px-3.5 font-semibold text-gray-700"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="submit" className="flex-1 bg-rose-500 text-white hover:bg-rose-600">
                  Ajouter au planning
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddApptModal(false)}
                  className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardProvider>
  );
}
