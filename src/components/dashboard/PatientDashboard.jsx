import { useEffect, useState } from "react";
import {
  Calendar,
  FolderHeart,
  User,
  LogOut,
  Cake,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  PlusCircle,
  Search,
  X,
  Edit3,
  FileText,
  Clock,
  Heart,
  AlertCircle,
  CalendarDays,
  Check,
  Stethoscope
} from "lucide-react";
import MomyCareLogo from "@/components/shared/MomyCareLogo";
import { loadPatientDashboardData } from "@/services/dashboardService";

function buildInitialProfile(user) {
  return {
    nom: user?.nom || user?.login || "Patiente",
    matricule: user?.matriculeSociale || user?.matricule || "--",
    birthday: user?.dateDeNaissance || "",
    phone: user?.numeroTelephone || user?.telephone || "",
    email: user?.email || "",
    adresse: [user?.adresse, user?.ville].filter(Boolean).join(", "),
    weekOfPregnancy: user?.semaineGrossesse || "--",
    bloodType: user?.groupeSanguin || "--",
    allergies: user?.allergies || "Non renseigne",
    lastDoctor: "--",
  };
}

function isConfirmed(status) {
  return String(status || "").toLowerCase().includes("confirm");
}

function isPast(status) {
  return String(status || "").toLowerCase().includes("pass");
}

export default function PatientDashboard({ user, onLogout }) {
  // ─── States ───────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("accueil"); // accueil, rdv, dossier, profil
  const [showBookModal, setShowBookModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const [profile, setProfile] = useState(() => buildInitialProfile(user));

  // Appointments data
  const [appointments, setAppointments] = useState([]);
  /*
  const [mockAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Meriem Ben Ali",
      specialty: "Gynécologue Obstétricien",
      date: "Vendredi 30 Mai 2026",
      time: "10:00",
      status: "Confirmé",
      type: "Échographie 2ème trimestre",
    },
    {
      id: 2,
      doctor: "Dr. Meriem Ben Ali",
      specialty: "Gynécologue Obstétricien",
      date: "15 Janvier 2026",
      time: "09:30",
      status: "Passé",
      type: "Consultation Routine",
    },
    {
      id: 3,
      doctor: "Dr. Anis Khemiri",
      specialty: "Pédiatre",
      date: "12 Décembre 2025",
      time: "14:00",
      status: "Passé",
      type: "Visite prénatale de conseil",
    },
    {
      id: 4,
      doctor: "Dr. Meriem Ben Ali",
      specialty: "Gynécologue Obstétricien",
      date: "10 Novembre 2025",
      time: "11:00",
      status: "Passé",
      type: "Échographie de datation",
    },
  ]);
  */

  // Doctors list for Search Modal
  const [availableDoctors, setAvailableDoctors] = useState([]);
  /*
  const mockDoctors = [
    { name: "Dr. Meriem Ben Ali", specialty: "Gynécologue Obstétricien", hospital: "Clinique El Amen, Tunis", availability: "Vendredi, Lundi", rating: "4.9" },
    { name: "Dr. Fatma Rebai", specialty: "Gynécologue Obstétricien", hospital: "Centre Médical Lac 2, Tunis", availability: "Mardi, Mercredi", rating: "4.8" },
    { name: "Dr. Anis Khemiri", specialty: "Pédiatre / Néonatalogiste", hospital: "Polyclinique Soukra, Tunis", availability: "Jeudi", rating: "4.7" },
    { name: "Dr. Selim Oueslati", specialty: "Gynécologue Obstétricien", hospital: "Clinique La Marsa, Tunis", availability: "Lundi, Mercredi", rating: "4.9" },
  ];
  */

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocForBooking, setSelectedDocForBooking] = useState("");
  const [newApptDate, setNewApptDate] = useState("2026-06-15");
  const [newApptTime, setNewApptTime] = useState("10:00");
  const [newApptType, setNewApptType] = useState("Consultation Routine");

  // Form states for profile editing
  const [editProfileForm, setEditProfileForm] = useState({ ...profile });
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoadingData(true);

      try {
        const data = await loadPatientDashboardData(user);

        if (!isMounted) return;

        setProfile(data.profile);
        setEditProfileForm(data.profile);
        setAppointments(data.appointments);
        setAvailableDoctors(data.doctors);
        setSelectedDocForBooking(data.doctors[0]?.name || "");
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // ─── Actions handlers ──────────────────────────────────────────
  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    setProfile(editProfileForm);
    setShowEditProfileModal(false);
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const formattedDate = new Date(newApptDate).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    // capitalize first letter
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const newAppt = {
      id: Date.now(),
      doctor: selectedDocForBooking || availableDoctors[0]?.name || "--",
      specialty: "Gynécologue Obstétricien",
      date: capitalizedDate,
      time: newApptTime,
      status: "Confirmé",
      type: newApptType,
    };
    setAppointments([newAppt, ...appointments]);
    setShowBookModal(false);
    setActiveTab("rdv");
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.filter((appt) => appt.id !== id));
    setShowCancelModal(false);
  };

  const activeNextAppt = appointments.find((appt) => isConfirmed(appt.status));
  const pastAppointments = appointments.filter((appt) => isPast(appt.status));

  // Calculate days to next appointment (mocked as 4 if exists, else "Aucun")
  const daysToNext = activeNextAppt ? 4 : "--";

  return (
    <div className="min-h-screen bg-[#fcf8fa] font-sans antialiased text-gray-800 selection:bg-rose-500 selection:text-white">
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-pink-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <MomyCareLogo size="md" variant="row" />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab("accueil")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === "accueil"
                  ? "bg-rose-50 text-rose-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Heart className="h-4 w-4" />
              Accueil
            </button>
            <button
              onClick={() => setActiveTab("rdv")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === "rdv"
                  ? "bg-rose-50 text-rose-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Mes RDV
            </button>
            <button
              onClick={() => setActiveTab("dossier")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === "dossier"
                  ? "bg-rose-50 text-rose-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <FolderHeart className="h-4 w-4" />
              Mon Dossier
            </button>
            <button
              onClick={() => setActiveTab("profil")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === "profil"
                  ? "bg-rose-50 text-rose-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <User className="h-4 w-4" />
              Profil
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Mobile Nav Button Indicator (simulated with icons) */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setActiveTab("accueil")}
                className={`p-2 rounded-lg ${activeTab === "accueil" ? "text-rose-600 bg-rose-50" : "text-gray-400"}`}
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab("rdv")}
                className={`p-2 rounded-lg ${activeTab === "rdv" ? "text-rose-600 bg-rose-50" : "text-gray-400"}`}
              >
                <Calendar className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab("dossier")}
                className={`p-2 rounded-lg ${activeTab === "dossier" ? "text-rose-600 bg-rose-50" : "text-gray-400"}`}
              >
                <FolderHeart className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab("profil")}
                className={`p-2 rounded-lg ${activeTab === "profil" ? "text-rose-600 bg-rose-50" : "text-gray-400"}`}
              >
                <User className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center justify-center h-10 w-10 rounded-xl border border-rose-100 text-rose-500 bg-rose-50/50 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 shadow-sm cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── BANNER (PINK) ────────────────────────────────────────── */}
      {activeTab === "accueil" && (
        <section className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-md">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Bonjour, <span className="text-rose-100">{profile.nom}</span>
              </h1>
              <p className="text-rose-50 text-lg font-medium opacity-90 max-w-xl">
                Votre prochain rendez-vous est dans <span className="bg-white/20 px-2 py-0.5 rounded-md font-bold text-white shadow-inner">{daysToNext}</span> jours.
              </p>
            </div>
            {activeNextAppt && (
              <button
                onClick={() => setActiveTab("rdv")}
                className="inline-flex items-center gap-2 self-start rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-rose-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <CalendarDays className="h-5 w-5" />
                Voir mes rendez-vous
              </button>
            )}
          </div>
        </section>
      )}

      {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoadingData && (
          <p className="mb-4 text-xs font-semibold text-rose-500">
            Chargement des donnees...
          </p>
        )}
        
        {/* VIEW 1: ACCUEIL */}
        {activeTab === "accueil" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1: MON PROFIL (Col Span 4) */}
            <section className="lg:col-span-4 space-y-6">
              <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-rose-500" />
                  Mon Profil
                </h2>
                
                {/* Profile Pic Container */}
                <div className="flex flex-col items-center my-6">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 border-2 border-rose-300 shadow-md">
                    <User className="h-12 w-12 text-rose-500" />
                    <span className="absolute bottom-0 right-0 rounded-full bg-rose-500 p-1.5 text-white shadow">
                      <Heart className="h-3 w-3 fill-current" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900">{profile.nom}</h3>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 mt-1">
                    Matricule : {profile.matricule}
                  </span>
                </div>

                {/* Details List */}
                <ul className="space-y-4 text-sm font-medium text-gray-600">
                  <li className="flex items-center gap-3 bg-rose-50/20 p-2.5 rounded-xl border border-rose-50/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                      <Cake className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Date de naissance</p>
                      <p className="text-gray-950 font-semibold">{profile.birthday}</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 bg-rose-50/20 p-2.5 rounded-xl border border-rose-50/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Téléphone</p>
                      <p className="text-gray-950 font-semibold">{profile.phone}</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 bg-rose-50/20 p-2.5 rounded-xl border border-rose-50/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Adresse Email</p>
                      <p className="text-gray-950 font-semibold truncate max-w-[200px]">{profile.email}</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 bg-rose-50/20 p-2.5 rounded-xl border border-rose-50/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Adresse physique</p>
                      <p className="text-gray-950 font-semibold">{profile.adresse}</p>
                    </div>
                  </li>
                </ul>

                {/* Edit Button */}
                <button
                  onClick={() => {
                    setEditProfileForm({ ...profile });
                    setShowEditProfileModal(true);
                  }}
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-200 py-3 text-sm font-bold text-rose-600 bg-white hover:bg-rose-50/50 hover:border-rose-300 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  Modifier mes coordonnées
                </button>
              </article>

              {/* MOCK PREGNANCY TRACKER */}
              <article className="rounded-3xl border border-pink-100 bg-gradient-to-b from-white to-pink-50/20 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                    <Stethoscope className="h-5 w-5 text-rose-500" />
                    Mon Suivi Grossesse
                  </h3>
                  <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-full">
                    Semaine {profile.weekOfPregnancy}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-500">
                    <span>Trimestre 2</span>
                    <span>Évolution : 60%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50 p-[2px]">
                    <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 shadow-inner" style={{ width: "60%" }}></div>
                  </div>
                  <div className="bg-white/80 border border-pink-100 rounded-2xl p-3 mt-4 text-xs space-y-1 shadow-sm">
                    <p className="font-bold text-rose-600">💡 Conseil MomyCare</p>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      Votre bébé a la taille d'un melon d'Espagne. N'oubliez pas de boire beaucoup d'eau et de faire des étirements légers.
                    </p>
                  </div>
                </div>
              </article>
            </section>

            {/* COLUMN 2: CENTER INFO (Col Span 5) */}
            <section className="lg:col-span-5 space-y-6">
              
              {/* NEXT APPOINTMENT CARD */}
              <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-rose-500" />
                  Prochain Rendez-vous
                </h2>

                {activeNextAppt ? (
                  <div className="mt-5 space-y-6">
                    <div className="flex items-start gap-4">
                      {/* Big Calendar Icon */}
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 shadow-inner shrink-0">
                        <Calendar className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-gray-900 text-lg leading-tight">
                          {activeNextAppt.doctor}
                        </h3>
                        <p className="text-xs font-semibold text-rose-600 bg-rose-50 inline-block px-2.5 py-0.5 rounded-full">
                          {activeNextAppt.specialty}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-2">
                          Type: <span className="text-gray-500 font-medium">{activeNextAppt.type}</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mt-1">
                          <Clock className="h-3.5 w-3.5 text-rose-400" />
                          <span>{activeNextAppt.date} à {activeNextAppt.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons for appointment */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setSelectedDocForBooking(activeNextAppt.doctor);
                          setNewApptType(activeNextAppt.type);
                          setShowBookModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-3.5 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-rose-200 py-3.5 text-sm font-bold text-rose-500 bg-white hover:bg-rose-50/50 hover:border-rose-300 transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        <X className="h-4 w-4" />
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto" />
                    <p className="text-sm font-medium text-gray-500">Vous n'avez aucun rendez-vous à venir.</p>
                    <button
                      onClick={() => setShowBookModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all duration-200 cursor-pointer"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Prendre rendez-vous
                    </button>
                  </div>
                )}
              </article>

              {/* ACTIONS RAPIDES */}
              <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                  <span className="text-rose-500">⚡</span>
                  Actions Rapides
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                  {/* PRENDRE RDV */}
                  <button
                    onClick={() => setShowBookModal(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-rose-500 text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white mb-3 shadow-inner">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-extrabold tracking-tight">Prendre RDV</span>
                  </button>

                  {/* RECHERCHER MEDECIN */}
                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-violet-600 text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white mb-3 shadow-inner">
                      <Search className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-extrabold tracking-tight text-center leading-tight">Rechercher Médecin</span>
                  </button>

                  {/* CONSULTER DOSSIER */}
                  <button
                    onClick={() => setActiveTab("dossier")}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-600 text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white mb-3 shadow-inner">
                      <FolderHeart className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-extrabold tracking-tight">Consulter Dossier</span>
                  </button>
                </div>
              </article>
            </section>

            {/* COLUMN 3: HISTORIQUE (Col Span 3) */}
            <section className="lg:col-span-3 space-y-6">
              <article className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-rose-500" />
                  Historique
                </h2>

                <div className="relative mt-6 pl-4 border-l-2 border-rose-100 space-y-6 text-sm">
                  {pastAppointments.map((appt) => (
                    <div key={appt.id} className="relative space-y-1">
                      {/* Timeline dot */}
                      <span className="absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 border-2 border-white shadow">
                        <Check className="h-2.5 w-2.5 text-white stroke-[3px]" />
                      </span>
                      <p className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">{appt.date}</p>
                      <h4 className="font-extrabold text-gray-900 leading-tight">{appt.doctor}</h4>
                      <p className="text-xs text-gray-500 font-medium">{appt.type}</p>
                      <span className="inline-block mt-1 text-[9px] font-black uppercase text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100/50">
                        Consultation
                      </span>
                    </div>
                  ))}
                  
                  {pastAppointments.length === 0 && (
                    <p className="text-xs font-semibold text-gray-400 text-center py-4">Aucun antécédent trouvé.</p>
                  )}
                </div>
              </article>
            </section>
          </div>
        )}

        {/* VIEW 2: MES RDV */}
        {activeTab === "rdv" && (
          <section className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-pink-50 pb-5">
              <div>
                <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                  <Calendar className="h-6.5 w-6.5 text-rose-500" />
                  Gestion de mes Rendez-vous
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Consultez, programmez ou annulez vos rendez-vous médicaux.</p>
              </div>
              <button
                onClick={() => setShowBookModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                Prendre nouveau rendez-vous
              </button>
            </div>

            {/* List of active and past appointments */}
            <div className="grid gap-6">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-200 ${
                    appt.status === "Confirmé"
                      ? "border-rose-100 bg-rose-50/10 hover:border-rose-200 shadow-sm"
                      : "border-gray-100 bg-gray-50/20 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                      appt.status === "Confirmé" ? "bg-rose-50 text-rose-500" : "bg-gray-100 text-gray-400"
                    }`}>
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-extrabold text-gray-900 text-base">{appt.doctor}</h4>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          appt.status === "Confirmé"
                            ? "bg-rose-100 border-rose-200 text-rose-700"
                            : "bg-emerald-50 border-emerald-100 text-emerald-700"
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-400">{appt.specialty} — <span className="text-gray-600">{appt.type}</span></p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Clock className="h-3.5 w-3.5 text-rose-400" />
                        <span>{appt.date} à {appt.time}</span>
                      </div>
                    </div>
                  </div>

                  {appt.status === "Confirmé" && (
                    <div className="flex items-center gap-2 mt-4 md:mt-0 self-end md:self-auto">
                      <button
                        onClick={() => {
                          setSelectedDocForBooking(appt.doctor);
                          setNewApptType(appt.type);
                          setShowBookModal(true);
                        }}
                        className="rounded-xl border border-rose-100 bg-white hover:bg-rose-50 text-rose-500 px-4 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIEW 3: MON DOSSIER */}
        {activeTab === "dossier" && (
          <section className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in">
            <div className="border-b border-pink-50 pb-5">
              <h2 className="text-2xl font-black text-gray-950 flex items-center gap-2">
                <FolderHeart className="h-7 w-7 text-rose-500" />
                Mon Dossier Médical Numérique
              </h2>
              <p className="text-sm font-medium text-gray-500 mt-1">Consultez l'historique de vos ordonnances, comptes-rendus et constantes vitales.</p>
            </div>

            {/* Dossier Grid Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Fiche Clinique */}
              <div className="border border-pink-100 bg-rose-50/10 p-5 rounded-2xl space-y-4">
                <h3 className="font-extrabold text-gray-900 border-b border-pink-100/50 pb-2 flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-rose-500" />
                  Informations Cliniques
                </h3>
                <ul className="text-xs font-semibold text-gray-500 space-y-2.5">
                  <li className="flex justify-between border-b border-dashed border-gray-100 pb-1">
                    <span>Groupe Sanguin</span>
                    <span className="text-rose-600 font-bold">{profile.bloodType}</span>
                  </li>
                  <li className="flex justify-between border-b border-dashed border-gray-100 pb-1">
                    <span>Allergies</span>
                    <span className="text-gray-950">{profile.allergies}</span>
                  </li>
                  <li className="flex justify-between border-b border-dashed border-gray-100 pb-1">
                    <span>Terme Prévu</span>
                    <span className="text-gray-950">15 Septembre 2026</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Gynécologue référent</span>
                    <span className="text-gray-950 font-bold">{profile.lastDoctor}</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Dernières Ordonnances */}
              <div className="border border-pink-100 bg-rose-50/10 p-5 rounded-2xl space-y-4">
                <h3 className="font-extrabold text-gray-900 border-b border-pink-100/50 pb-2 flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-rose-500" />
                  Dernières Ordonnances
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-pink-50 shadow-sm">
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">Compléments prénataux</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Acide folique, Fer — 15 Janvier 2026</p>
                    </div>
                    <button className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer">Télécharger</button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-pink-50 shadow-sm">
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">Bilan sanguin standard</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Analyses Labo — 10 Novembre 2025</p>
                    </div>
                    <button className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer">Télécharger</button>
                  </div>
                </div>
              </div>

              {/* Card 3: Imagerie & Échographies */}
              <div className="border border-pink-100 bg-rose-50/10 p-5 rounded-2xl space-y-4">
                <h3 className="font-extrabold text-gray-900 border-b border-pink-100/50 pb-2 flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-rose-500" />
                  Imagerie & Échographies
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-pink-50 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-pink-100 border border-pink-200/50 flex items-center justify-center text-pink-600 shrink-0">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900">Écho Morphologique</h4>
                        <p className="text-[9px] font-bold text-emerald-600">Résultat normal</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-rose-600 hover:underline shrink-0 cursor-pointer">Consulter</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 4: PROFIL DETAIL */}
        {activeTab === "profil" && (
          <section className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto animate-fade-in">
            <div className="border-b border-pink-50 pb-4 text-center">
              <h2 className="text-2xl font-black text-gray-950">Modifier Mes Coordonnées</h2>
              <p className="text-sm font-medium text-gray-400 mt-1">Mettez à jour vos informations de contact et de localisation.</p>
            </div>
            
            <form onSubmit={handleEditProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.nom}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, nom: e.target.value })}
                    className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.phone}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                  className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Adresse de Résidence</label>
                <input
                  type="text"
                  required
                  value={editProfileForm.adresse}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, adresse: e.target.value })}
                  className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all bg-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-3.5 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600 shadow-md transition-all duration-300 cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("accueil")}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      {/* ─── MODALS ──────────────────────────────────────────────── */}
      
      {/* 1. EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="border-b border-pink-50 pb-3">
              <h3 className="text-xl font-black text-gray-900">Coordonnées de Profil</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Modifiez vos données de contact ci-dessous.</p>
            </div>
            
            <form onSubmit={handleEditProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nom Complet</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.nom}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, nom: e.target.value })}
                    className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
                  <input
                    type="text"
                    required
                    value={editProfileForm.phone}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Adresse Email</label>
                <input
                  type="email"
                  required
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                  className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Adresse Physique</label>
                <input
                  type="text"
                  required
                  value={editProfileForm.adresse}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, adresse: e.target.value })}
                  className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-3.5 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600 shadow-md cursor-pointer"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CANCEL APPOINTMENT MODAL */}
      {showCancelModal && activeNextAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl relative space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">Annuler le Rendez-vous ?</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Êtes-vous sûre de vouloir annuler votre consultation avec <strong className="text-gray-700">{activeNextAppt.doctor}</strong> prévue pour le <strong className="text-gray-700">{activeNextAppt.date}</strong> ?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleCancelAppointment(activeNextAppt.id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3 text-sm font-extrabold text-white hover:bg-rose-600 shadow-md cursor-pointer"
              >
                Confirmer l'annulation
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 transition-all cursor-pointer"
              >
                Garder le RDV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOOK APPOINTMENT MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowBookModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="border-b border-pink-50 pb-3 flex items-center gap-2">
              <PlusCircle className="h-5.5 w-5.5 text-rose-500" />
              <div>
                <h3 className="text-lg font-black text-gray-900">Prendre un Rendez-vous</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Planifiez une consultation dans notre centre.</p>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Choisir le Médecin</label>
                <select
                  value={selectedDocForBooking}
                  onChange={(e) => setSelectedDocForBooking(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all font-semibold"
                >
                  {availableDoctors.map((doc) => (
                    <option key={doc.name} value={doc.name}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Type de Consultation</label>
                <select
                  value={newApptType}
                  onChange={(e) => setNewApptType(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all font-semibold"
                >
                  <option value="Consultation Routine">Consultation de Routine</option>
                  <option value="Échographie 1er trimestre">Échographie de 1er trimestre</option>
                  <option value="Échographie 2ème trimestre">Échographie morphologique (2ème trimestre)</option>
                  <option value="Échographie 3ème trimestre">Échographie de croissance (3ème trimestre)</option>
                  <option value="Urgence gynécologique">Urgence</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                  <input
                    type="date"
                    required
                    value={newApptDate}
                    onChange={(e) => setNewApptDate(e.target.value)}
                    className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all font-semibold text-gray-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Heure</label>
                  <input
                    type="time"
                    required
                    value={newApptTime}
                    onChange={(e) => setNewApptTime(e.target.value)}
                    className="w-full rounded-xl border border-pink-100 px-3.5 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all font-semibold text-gray-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-3.5 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600 shadow-md cursor-pointer"
                >
                  Confirmer la réservation
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. SEARCH DOCTOR MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="border-b border-pink-50 pb-3 flex items-center gap-2">
              <Search className="h-5.5 w-5.5 text-rose-500" />
              <div>
                <h3 className="text-lg font-black text-gray-900">Rechercher un Spécialiste</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Trouvez le médecin idéal pour votre suivi.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Search Bar Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par nom, spécialité..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white transition-all font-semibold"
                />
                <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
              </div>

              {/* Doctors List */}
              <div className="max-h-[250px] overflow-y-auto space-y-3 pr-1">
                {availableDoctors
                  .filter(
                    (doc) =>
                      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((doc) => (
                    <div
                      key={doc.name}
                      className="p-3.5 rounded-xl border border-gray-100 hover:border-pink-100 bg-rose-50/5 flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-gray-900 text-sm">{doc.name}</h4>
                        <p className="text-xs text-rose-600 font-bold">{doc.specialty}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{doc.hospital} — dispo : {doc.availability}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDocForBooking(doc.name);
                          setShowSearchModal(false);
                          setShowBookModal(true);
                        }}
                        className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
                      >
                        Réserver
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
