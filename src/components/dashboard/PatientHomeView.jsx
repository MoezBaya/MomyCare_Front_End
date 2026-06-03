// src/components/dashboard/PatientHomeView.jsx
import { Calendar, Cake, Phone, Mail, MapPin, Edit3, Heart, Clock, FileText, PlusCircle, AlertCircle, User, Stethoscope, Search, Check, FolderHeart, Activity, CalendarDays, Video, Pill, TrendingUp, SmilePlus, Droplet, Scale, Brain } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Suppression de l'import Progress

export default function PatientHomeView() {
  const {
    profile,
    activeNextAppt,
    daysToNext,
    pastAppointments = [],
    openBookModal,
    openSearchModal,
    setActiveTab,
    openCancelModal,
    handleEditNextAppt,
  } = usePatientContext();

  // Données fictives pour démonstration (à connecter à l'API réelle)
  const healthStats = {
    tension: "12/8",
    poids: "67 kg",
    glycemie: "0.95 g/L",
    semaineGrossesse: profile.weekOfPregnancy || "26",
  };
  const nextMedication = "Vitamine D – 1 comprimé à 8h";
  const symptoms = ["Fatigue", "Nausées", "Jambes lourdes"];

  return (
    <div className="space-y-8">
      {/* Header hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 p-6 text-white shadow-xl md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Bonjour, <span className="text-rose-100">{profile.nom}</span>
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-rose-100">
              <CalendarDays className="h-4 w-4" />
              <span>Prochain rendez-vous dans</span>
              <Badge className="border-white/30 bg-white/20 text-white px-2 py-0.5 text-sm font-semibold">
                {daysToNext} jours
              </Badge>
            </div>
          </div>
          {activeNextAppt && (
            <Button
              onClick={() => setActiveTab("rdv")}
              className="bg-white text-rose-700 hover:bg-rose-50 shadow-md rounded-full px-5 py-2"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Voir mon agenda
            </Button>
          )}
        </div>
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-pink-400/20 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Colonne gauche – Profil & grossesse */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="border-rose-100 shadow-md transition hover:shadow-lg">
            <CardHeader className="border-b border-rose-50 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <User className="h-5 w-5 text-rose-500" />
                Mon profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-2">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-100 shadow-inner">
                    <User className="h-10 w-10 text-rose-500" />
                  </div>
                  <span className="absolute bottom-0 right-0 rounded-full bg-rose-500 p-1.5 text-white shadow">
                    <Heart className="h-3 w-3 fill-current" />
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{profile.nom}</h3>
                <Badge variant="outline" className="mt-1 text-xs text-gray-500 border-gray-200">
                  Matricule {profile.matricule}
                </Badge>
              </div>
              <div className="mt-4 space-y-3">
                <InfoRow icon={Cake} label="Date de naissance" value={profile.birthday} />
                <InfoRow icon={Phone} label="Téléphone" value={profile.phone} />
                <InfoRow icon={Mail} label="Email" value={profile.email} />
                <InfoRow icon={MapPin} label="Adresse" value={profile.adresse} />
              </div>
              <Button
                onClick={openBookModal}
                variant="outline"
                className="mt-6 w-full rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Modifier mon profil
              </Button>
            </CardContent>
          </Card>

          <Card className="border-rose-100 bg-gradient-to-b from-white to-rose-50/30 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Stethoscope className="h-5 w-5 text-rose-500" />
                Suivi de grossesse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm font-semibold text-gray-600">
                <span>Semaine {healthStats.semaineGrossesse}</span>
                <span className="text-rose-600">Trimestre 2</span>
              </div>
              {/* Barre de progression simple sans Progress */}
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 w-3/5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
              </div>
              <div className="mt-4 rounded-xl bg-white p-3 text-sm shadow-sm">
                <p className="font-bold text-rose-600">💡 Conseil personnalisé</p>
                <p className="mt-1 text-gray-600">
                  Votre bébé a la taille d'un melon d'Espagne. Pensez à boire 1,5 L d'eau par jour et à pratiquer une activité douce.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Innovation : Widget santé rapide */}
          <Card className="border-rose-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Activity className="h-5 w-5 text-rose-500" />
                Mon état de santé
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <HealthCard icon={Droplet} label="Tension" value={healthStats.tension} />
              <HealthCard icon={Scale} label="Poids" value={healthStats.poids} />
              <HealthCard icon={TrendingUp} label="Glycémie" value={healthStats.glycemie} />
              <HealthCard icon={Brain} label="Moral" value="👍 Bien" />
            </CardContent>
          </Card>

          {/* Innovation : Rappel médicamenteux */}
          <Card className="border-rose-100 bg-rose-50/30 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md font-bold text-gray-800">
                <Pill className="h-5 w-5 text-rose-500" />
                Prochain traitement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{nextMedication}</p>
              <Button variant="link" className="mt-2 h-auto p-0 text-rose-600 text-xs">
                Voir mon carnet de santé
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Colonne centrale – Prochain RDV + actions rapides */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="border-rose-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Calendar className="h-5 w-5 text-rose-500" />
                Prochain rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeNextAppt ? (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 shadow-inner">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-md font-bold text-gray-900">{activeNextAppt.doctor}</h3>
                      <Badge className="mt-1 bg-rose-50 text-rose-600 border-rose-100 font-normal">
                        {activeNextAppt.specialty}
                      </Badge>
                      <p className="mt-2 text-sm text-gray-600">
                        {activeNextAppt.type} –{" "}
                        <span className="font-semibold text-gray-800">
                          {activeNextAppt.date} à {activeNextAppt.time}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => handleEditNextAppt(activeNextAppt)} className="flex-1 bg-rose-500 hover:bg-rose-600 rounded-xl">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                    <Button variant="outline" onClick={openCancelModal} className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl">
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">Aucun rendez-vous programmé</p>
                  <Button onClick={openBookModal} variant="ghost" className="mt-4 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Prendre rendez-vous
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Innovation : Télémédecine */}
          <Card className="border-rose-100 shadow-md bg-gradient-to-r from-rose-50/50 to-pink-50/30">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <h3 className="font-bold text-gray-800">Consultation à distance</h3>
                <p className="text-sm text-gray-500">Disponible dès maintenant</p>
              </div>
              <Button className="bg-rose-500 hover:bg-rose-600 rounded-full px-5">
                <Video className="mr-2 h-4 w-4" />
                Appeler
              </Button>
            </CardContent>
          </Card>

          <Card className="border-rose-100 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800">⚡ Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <QuickAction icon={Calendar} label="Prendre RDV" onClick={openBookModal} color="rose" />
                <QuickAction icon={Search} label="Rechercher médecin" onClick={openSearchModal} color="violet" />
                <QuickAction icon={FolderHeart} label="Mon dossier" onClick={() => setActiveTab("dossier")} color="blue" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite – Historique & symptômes */}
        <div className="space-y-6 lg:col-span-3">
          <Card className="border-rose-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <FileText className="h-5 w-5 text-rose-500" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-rose-100 pl-5 ml-2 space-y-6">
                {pastAppointments.length > 0 ? (
                  pastAppointments.map((appt) => (
                    <div key={appt.id} className="relative">
                      <div className="absolute -left-[23px] flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                        <Check className="h-3 w-3 stroke-[3px]" />
                      </div>
                      <p className="text-xs font-semibold text-gray-400">{appt.date}</p>
                      <p className="font-bold text-gray-800">{appt.doctor}</p>
                      <p className="text-sm text-gray-500">{appt.type}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-sm text-gray-400">Aucun historique</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Innovation : Suivi des symptômes */}
          <Card className="border-rose-100 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md font-bold text-gray-800">
                <SmilePlus className="h-5 w-5 text-rose-500" />
                Mon ressenti aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-2">
                {["😊", "😐", "😔", "🤰"].map((emoji, idx) => (
                  <button key={idx} className="rounded-full bg-rose-50 p-3 text-xl transition hover:scale-110">
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {symptoms.map((s, idx) => (
                  <Badge key={idx} variant="outline" className="border-rose-200 text-rose-600 bg-rose-50">
                    {s}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" className="mt-3 w-full text-rose-600 text-xs">
                + Ajouter un symptôme
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Composants internes réutilisables
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-rose-50/80 bg-rose-50/10 p-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function HealthCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-rose-100 bg-white p-3 text-center shadow-sm">
      <Icon className="mx-auto h-5 w-5 text-rose-400" />
      <p className="mt-1 text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick, color }) {
  const colorMap = {
    rose: "from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
    violet: "from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600",
    blue: "from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600",
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${colorMap[color]} p-3 text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg`}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}