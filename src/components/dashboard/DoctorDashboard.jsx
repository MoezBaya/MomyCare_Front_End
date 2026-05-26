import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  FolderOpen,
  Pill,
  Settings,
  LogOut,
  Bell,
  Check,
  X,
  FileText,
  Clock,
  Plus,
  ClipboardList,
  Home,
  HeartPulse
} from "lucide-react";
import MomyCareLogo from "@/components/shared/MomyCareLogo";
import { loadDoctorDashboardData } from "@/services/dashboardService";

function buildInitialProfile(user) {
  return {
    nom: user?.nom || user?.login || "Gynecologue",
    email: user?.email || "",
    phone: user?.numeroTelephone || user?.telephone || "",
    adresse: [user?.adresse, user?.ville].filter(Boolean).join(", "),
    specialty: user?.specialite || "Gynecologue Obstetricien",
    matriculeCachet: user?.matriculeCachet || "--",
    numeroAgrement: user?.numeroAgrement || "--",
    experience: user?.experience || "--",
  };
}

function isWaiting(status) {
  return String(status || "").toLowerCase().includes("attente");
}

export default function DoctorDashboard({ user, onLogout }) {
  // ─── States ───────────────────────────────────────────────────
  const [activeSidebar, setActiveSidebar] = useState("accueil"); // accueil, rdv, patients, dossiers, medicaments, parametres
  const [activeHeaderTab, setActiveHeaderTab] = useState("tableau"); // tableau, rdv, profil
  const [showAddApptModal, setShowAddApptModal] = useState(false);
  const [notifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(() => buildInitialProfile(user));
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Gynaecologist's name
  const docName = doctorProfile.nom;

  // Appointments List
  const [appointments, setAppointments] = useState([]);

  // Form states for adding appointment
  const [newPatientName, setNewPatientName] = useState("");
  const [newTime, setNewTime] = useState("11:30");

  // Patients list
  const [patients, setPatients] = useState([]);

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState([]);

  // ─── Computations for KPIs ──────────────────────────────────────
  const countTodayRDV = appointments.length;
  const countWaiting = appointments.filter((appt) => isWaiting(appt.status)).length;
  const countPatients = patients.length;
  const countConsultations = prescriptions.length;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoadingData(true);

      try {
        const data = await loadDoctorDashboardData(user);

        if (!isMounted) return;

        setDoctorProfile(data.profile);
        setAppointments(data.appointments);
        setPatients(data.patients);
        setPrescriptions(data.prescriptions);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // ─── Action Handlers ───────────────────────────────────────────
  const handleConfirmAppointment = (id) => {
    setAppointments(
      appointments.map((appt) => (appt.id === id ? { ...appt, status: "Confirmé" } : appt))
    );
  };

  const handleCancelAppointment = (id) => {
    setAppointments(
      appointments.map((appt) => (appt.id === id ? { ...appt, status: "Annulé" } : appt))
    );
  };

  const handleAddAppointmentSubmit = (e) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newAppt = {
      id: Date.now(),
      time: newTime,
      patient: newPatientName,
      status: "En attente",
    };

    // Add to list and sort by time
    const updated = [...appointments, newAppt].sort((a, b) => a.time.localeCompare(b.time));
    setAppointments(updated);

    // If patient is new, add to patients list too
    if (!patients.some((p) => p.name.toLowerCase() === newPatientName.toLowerCase())) {
      setPatients([
        ...patients,
        {
          id: Date.now() + 10,
          name: newPatientName,
          phone: "+216 98 000 000",
          email: `${newPatientName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
          termDate: "À définir",
          progress: "Non spécifié",
        },
      ]);
    }

    setNewPatientName("");
    setShowAddApptModal(false);
  };

  return (
    <div className="flex h-screen bg-[#faf7f9] overflow-hidden font-sans antialiased text-gray-800">
      
      {/* ─── SIDEBAR (LEFT) ───────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-pink-100 flex flex-col justify-between p-5 shrink-0 h-full">
        <div className="space-y-8">
          {/* Logo Area */}
          <MomyCareLogo size="md" variant="col" className="py-2" />

          {/* Sidebar Menu Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveSidebar("accueil")}
              className={`flex items-center gap-3.5 w-full rounded-2xl px-4.5 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSidebar === "accueil"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "text-gray-500 hover:bg-rose-50/50 hover:text-rose-600"
              }`}
            >
              <Home className="h-5 w-5" />
              Accueil
            </button>
            <button
              onClick={() => setActiveSidebar("rdv")}
              className={`flex items-center justify-between w-full rounded-2xl px-4.5 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSidebar === "rdv"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "text-gray-500 hover:bg-rose-50/50 hover:text-rose-600"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Calendar className="h-5 w-5" />
                RDV
              </div>
              <span className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-[10px] font-black leading-none ${
                activeSidebar === "rdv" ? "bg-white text-rose-600" : "bg-rose-500 text-white"
              }`}>
                {countWaiting}
              </span>
            </button>
            <button
              onClick={() => setActiveSidebar("patients")}
              className={`flex items-center gap-3.5 w-full rounded-2xl px-4.5 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSidebar === "patients"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "text-gray-500 hover:bg-rose-50/50 hover:text-rose-600"
              }`}
            >
              <Users className="h-5 w-5" />
              Patients
            </button>
            <button
              onClick={() => setActiveSidebar("dossiers")}
              className={`flex items-center gap-3.5 w-full rounded-2xl px-4.5 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSidebar === "dossiers"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "text-gray-500 hover:bg-rose-50/50 hover:text-rose-600"
              }`}
            >
              <FolderOpen className="h-5 w-5" />
              Dossiers
            </button>
            <button
              onClick={() => setActiveSidebar("medicaments")}
              className={`flex items-center gap-3.5 w-full rounded-2xl px-4.5 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSidebar === "medicaments"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "text-gray-500 hover:bg-rose-50/50 hover:text-rose-600"
              }`}
            >
              <Pill className="h-5 w-5" />
              Médicaments
            </button>
            <button
              onClick={() => setActiveSidebar("parametres")}
              className={`flex items-center gap-3.5 w-full rounded-2xl px-4.5 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeSidebar === "parametres"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "text-gray-500 hover:bg-rose-50/50 hover:text-rose-600"
              }`}
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </button>
          </nav>
        </div>

        {/* Logout at bottom */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3.5 w-full rounded-2xl px-4.5 py-3.5 text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </aside>

      {/* ─── MAIN AREA (RIGHT) ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ─── TOP HEADER NAVBAR ─────────────────────────────────── */}
        <header className="h-20 border-b border-pink-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0 z-20">
          {/* Tabs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveHeaderTab("tableau")}
              className={`text-sm font-bold py-2 border-b-2 transition-all duration-150 cursor-pointer ${
                activeHeaderTab === "tableau"
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => {
                setActiveHeaderTab("rdv");
                setActiveSidebar("rdv");
              }}
              className={`text-sm font-bold py-2 border-b-2 transition-all duration-150 cursor-pointer ${
                activeHeaderTab === "rdv" && activeSidebar === "rdv"
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Rendez-vous
            </button>
            <button
              onClick={() => setActiveHeaderTab("profil")}
              className={`text-sm font-bold py-2 border-b-2 transition-all duration-150 cursor-pointer ${
                activeHeaderTab === "profil"
                  ? "border-rose-500 text-rose-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Profil
            </button>
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center gap-4 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer border border-gray-100"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border border-white animate-pulse"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-pink-100 bg-white p-4 shadow-xl z-50 space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase">Notifications</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-2.5 rounded-xl bg-rose-50/20 border border-rose-50/50 text-xs font-medium text-gray-700 space-y-1">
                        <p>{notif.text}</p>
                        <span className="text-[10px] text-gray-400 block font-bold">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Info Card */}
            <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white font-bold text-sm shadow-md">
                Dr
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-black text-gray-900">Dr. {docName}</p>
                <p className="text-[10px] font-bold text-gray-400">Médecin Gynécologue</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl hover:bg-rose-50 text-rose-500 transition-all cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* ─── CONTAINER CONTENT ───────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {isLoadingData && (
            <p className="text-xs font-semibold text-rose-500">
              Chargement des donnees...
            </p>
          )}
          
          {/* VIEW: ACCUEIL / TABLEAU DE BORD */}
          {activeSidebar === "accueil" && activeHeaderTab === "tableau" && (
            <>
              {/* Page Greeting Header */}
              <div className="space-y-1.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">
                  Bonjour, Dr. {docName}
                </h1>
                <p className="text-sm font-semibold text-gray-400">
                  Voici un aperçu de votre journée de consultations et de suivis de grossesse.
                </p>
              </div>

              {/* 4 KPI CARDS */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. RDV Aujourd'hui (Pink) */}
                <article className="rounded-3xl border border-pink-100 bg-[#fef1f6] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-rose-600">RDV Aujourd'hui</p>
                    <h2 className="text-4xl font-black text-rose-950">{countTodayRDV}</h2>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-white text-rose-500 flex items-center justify-center shadow-inner">
                    <Calendar className="h-6 w-6" />
                  </div>
                </article>

                {/* 2. En Attente (Yellow) */}
                <article className="rounded-3xl border border-yellow-100 bg-[#fefcf1] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-amber-600">En attente</p>
                    <h2 className="text-4xl font-black text-amber-950">{countWaiting}</h2>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-white text-amber-500 flex items-center justify-center shadow-inner">
                    <Clock className="h-6 w-6" />
                  </div>
                </article>

                {/* 3. Patients (Green) */}
                <article className="rounded-3xl border border-emerald-100 bg-[#f1fef6] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Patients</p>
                    <h2 className="text-4xl font-black text-emerald-950">{countPatients}</h2>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-white text-emerald-500 flex items-center justify-center shadow-inner">
                    <Users className="h-6 w-6" />
                  </div>
                </article>

                {/* 4. Consultations (Purple) */}
                <article className="rounded-3xl border border-violet-100 bg-[#f5f1fe] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-violet-600">Consultations</p>
                    <h2 className="text-4xl font-black text-violet-950">{countConsultations}</h2>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-white text-violet-500 flex items-center justify-center shadow-inner">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                </article>
              </section>

              {/* TABLE: RENDEZ-VOUS DU JOUR */}
              <section className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-pink-50 flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <ClipboardList className="h-5.5 w-5.5 text-rose-500" />
                    Rendez-vous du jour
                  </h3>
                  <button
                    onClick={() => setShowAddApptModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs px-4 py-2.5 shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter rendez-vous
                  </button>
                </div>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-rose-50/20 text-gray-400 font-extrabold text-[10px] uppercase tracking-wider border-b border-pink-50">
                        <th className="py-4 px-6">Heure</th>
                        <th className="py-4 px-6">Patient</th>
                        <th className="py-4 px-6">Statut</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-50/50 text-sm font-semibold text-gray-700">
                      {appointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-rose-50/5 transition-all">
                          <td className="py-4 px-6 font-extrabold text-rose-500">
                            {appt.time}
                          </td>
                          <td className="py-4 px-6 font-bold text-gray-900">
                            {appt.patient}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1.5">
                              <span className={`h-2 w-2 rounded-full ${
                                appt.status === "En attente"
                                  ? "bg-rose-500"
                                  : appt.status === "Confirmé"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`} />
                              <span className={`text-xs font-extrabold ${
                                appt.status === "En attente"
                                  ? "text-rose-600"
                                  : appt.status === "Confirmé"
                                  ? "text-emerald-600"
                                  : "text-amber-600"
                              }`}>
                                {appt.status}
                              </span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {appt.status === "En attente" ? (
                                <>
                                  <button
                                    onClick={() => handleConfirmAppointment(appt.id)}
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                                    title="Confirmer"
                                  >
                                    <Check className="h-4 w-4 stroke-[3px]" />
                                  </button>
                                  <button
                                    onClick={() => handleCancelAppointment(appt.id)}
                                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                                    title="Annuler/Décliner"
                                  >
                                    <X className="h-4 w-4 stroke-[3px]" />
                                  </button>
                                </>
                              ) : appt.status === "Confirmé" ? (
                                <button
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                                  title="Consulter dossier complet"
                                  onClick={() => {
                                    setActiveSidebar("dossiers");
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                                  Annulé
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* VIEW: TOUS LES RENDEZ-VOUS */}
          {activeSidebar === "rdv" && (
            <section className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-pink-50 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                    <Calendar className="h-7 w-7 text-rose-500" />
                    Planning des consultations
                  </h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Gérez le planning journalier de vos patientes.</p>
                </div>
                <button
                  onClick={() => setShowAddApptModal(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-rose-500 hover:bg-rose-600 px-5 py-3 text-sm font-extrabold text-white shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  Nouveau Rendez-vous
                </button>
              </div>

              <div className="grid gap-4">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-4 border border-gray-100 hover:border-pink-100 rounded-2xl flex items-center justify-between bg-rose-50/5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-900">{appt.patient}</h4>
                        <p className="text-xs text-gray-400 font-semibold">Consultation à {appt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        appt.status === "Confirmé"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                          : appt.status === "Annulé"
                          ? "bg-rose-50 border-rose-100 text-rose-700"
                          : "bg-amber-50 border-amber-100 text-amber-700"
                      }`}>
                        {appt.status}
                      </span>
                      {appt.status === "En attente" && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleConfirmAppointment(appt.id)}
                            className="p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[3px]" />
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="p-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5 stroke-[3px]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VIEW: GESTION DES PATIENTS */}
          {activeSidebar === "patients" && (
            <section className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-pink-50 pb-5">
                <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                  <Users className="h-7 w-7 text-rose-500" />
                  Base de Données des Patientes ({patients.length})
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Consultez et suivez l'avancement de grossesse de vos patientes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patients.map((pat) => (
                  <div key={pat.id} className="p-5 border border-pink-50 rounded-2xl bg-rose-50/5 space-y-3">
                    <div className="flex items-center justify-between border-b border-pink-50/50 pb-2">
                      <h4 className="font-black text-gray-900">{pat.name}</h4>
                      <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        {pat.progress}
                      </span>
                    </div>
                    <ul className="text-xs text-gray-500 font-semibold space-y-1.5">
                      <li>Tél : <span className="text-gray-900">{pat.phone}</span></li>
                      <li>Email : <span className="text-gray-900">{pat.email}</span></li>
                      <li>Date d'accouchement prévue : <span className="text-rose-600 font-bold">{pat.termDate}</span></li>
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VIEW: DOSSIERS PATIENT */}
          {activeSidebar === "dossiers" && (
            <section className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-pink-50 pb-5">
                <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                  <FolderOpen className="h-7 w-7 text-rose-500" />
                  Dossiers Obstétriques & Cliniques
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Consultez l'historique médical complet et téléchargez les examens cliniques.</p>
              </div>

              <div className="space-y-4">
                {patients.map((pat) => (
                  <div key={pat.id} className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-pink-100 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shadow-inner">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-900">{pat.name}</h4>
                        <p className="text-xs text-gray-400 font-semibold">Suivi prénatal — Terme : {pat.termDate}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Téléchargement du dossier de ${pat.name}...`)}
                      className="rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs px-4 py-2.5 transition-all cursor-pointer"
                    >
                      Consulter dossier complet
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VIEW: MEDICAMENTS & PRESCRIPTIONS */}
          {activeSidebar === "medicaments" && (
            <section className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-pink-50 pb-5">
                <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                  <Pill className="h-7 w-7 text-rose-500" />
                  Ordonnances & Rédacteur de prescriptions
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Éditez ou consultez les ordonnances prescrites aux patientes.</p>
              </div>

              <div className="space-y-4">
                {prescriptions.map((pres) => (
                  <div key={pres.id} className="p-5 border border-pink-50 bg-rose-50/5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center border-b border-pink-50 pb-2">
                      <h4 className="font-extrabold text-gray-900">{pres.patient}</h4>
                      <span className="text-[10px] text-gray-400 font-bold">{pres.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-600">Médicaments : <span className="text-gray-900">{pres.meds}</span></p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VIEW: PARAMETRES & PROFILE */}
          {(activeSidebar === "parametres" || activeHeaderTab === "profil") && (
            <section className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm max-w-xl mx-auto space-y-6 animate-fade-in">
              <div className="border-b border-pink-50 pb-4 text-center">
                <h2 className="text-2xl font-black text-gray-950">Profil Professionnel & Réglages</h2>
                <p className="text-sm font-medium text-gray-400 mt-1">Gérez vos préférences de cabinet et vos coordonnées.</p>
              </div>

              <div className="space-y-4 text-sm font-semibold text-gray-600">
                <div className="p-4 rounded-xl bg-rose-50/10 border border-pink-50 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Nom et Titre</span>
                  <p className="text-gray-950 font-bold">Dr. {docName}</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-50/10 border border-pink-50 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Spécialité</span>
                  <p className="text-gray-950 font-bold">{doctorProfile.specialty}</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-50/10 border border-pink-50 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Adresse du cabinet</span>
                  <p className="text-gray-950 font-bold">{doctorProfile.adresse || "--"}</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-50/10 border border-pink-50 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-black">Téléphone Pro</span>
                  <p className="text-gray-950 font-bold">{doctorProfile.phone || "--"}</p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ─── ADD APPOINTMENT MODAL (DOCTOR) ───────────────────────── */}
      {showAddApptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAddApptModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-pink-50 pb-3 flex items-center gap-2">
              <Plus className="h-5.5 w-5.5 text-rose-500" />
              <div>
                <h3 className="text-lg font-black text-gray-900">Ajouter un rendez-vous</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Planifiez une consultation dans le planning du jour.</p>
              </div>
            </div>

            <form onSubmit={handleAddAppointmentSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Nom de la patiente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Fatma Ben Youssef"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Heure du rendez-vous</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all font-semibold text-gray-700"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 py-3.5 text-sm font-extrabold text-white shadow-md cursor-pointer"
                >
                  Ajouter au planning
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddApptModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
