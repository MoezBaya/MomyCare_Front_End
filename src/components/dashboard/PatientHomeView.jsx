import { Calendar, Cake, Phone, Mail, MapPin, Edit3, Heart, Clock, FileText, PlusCircle, AlertCircle, User, Stethoscope, Search, Check, FolderHeart } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  return (
    <>
      <Card className="w-full overflow-hidden border-pink-200 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 py-0 text-white shadow-md">
        <CardContent className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Bonjour, <span className="text-rose-100">{profile.nom}</span>
            </h1>
            <p className="text-rose-50 text-lg font-medium opacity-90 max-w-xl">
              Votre prochain rendez-vous est dans{" "}
              <Badge className="border-white/30 bg-white/20 px-2 py-0.5 text-white">
                {daysToNext}
              </Badge>{" "}
              jours.
            </p>
          </div>
          {activeNextAppt && (
            <Button
              type="button"
              onClick={() => setActiveTab("rdv")}
              className="self-start rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-rose-600 shadow-lg hover:bg-white/95 hover:shadow-xl"
            >
              <Calendar className="h-5 w-5" />
              Voir mes rendez-vous
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-4 space-y-6">
          <Card className="border-pink-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="border-b border-pink-50 pb-3">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <User className="h-5 w-5 text-rose-500" />
                Mon Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="my-6 flex flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-rose-300 bg-rose-50 shadow-md">
                  <User className="h-12 w-12 text-rose-500" />
                  <span className="absolute bottom-0 right-0 rounded-full bg-rose-500 p-1.5 text-white shadow">
                    <Heart className="h-3 w-3 fill-current" />
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{profile.nom}</h3>
                <Badge variant="outline" className="mt-1 normal-case tracking-normal text-gray-500">
                  Matricule : {profile.matricule}
                </Badge>
              </div>
              <ul className="space-y-4 text-sm font-medium text-gray-600">
                <li className="flex items-center gap-3 rounded-xl border border-rose-50/50 bg-rose-50/20 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                    <Cake className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">Date de naissance</p>
                    <p className="font-semibold text-gray-950">{profile.birthday}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 rounded-xl border border-rose-50/50 bg-rose-50/20 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">Téléphone</p>
                    <p className="font-semibold text-gray-950">{profile.phone}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 rounded-xl border border-rose-50/50 bg-rose-50/20 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Adresse Email</p>
                    <p className="max-w-[200px] truncate font-semibold text-gray-950">{profile.email}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 rounded-xl border border-rose-50/50 bg-rose-50/20 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">Adresse physique</p>
                    <p className="font-semibold text-gray-950">{profile.adresse}</p>
                  </div>
                </li>
              </ul>
              <Button
                type="button"
                onClick={openBookModal}
                variant="outline"
                className="mt-6 h-auto w-full rounded-2xl border-rose-200 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50/50 hover:border-rose-300"
              >
                <Edit3 className="h-4 w-4" />
                Modifier mes coordonnées
              </Button>
            </CardContent>
          </Card>

          <Card className="border-pink-100 bg-gradient-to-b from-white to-pink-50/20 shadow-sm">
            <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                <Stethoscope className="h-5 w-5 text-rose-500" />
                Mon Suivi Grossesse
              </h3>
              <Badge className="border-rose-200 bg-rose-100 text-rose-700">
                Semaine {profile.weekOfPregnancy}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>Trimestre 2</span>
                <span>Évolution : 60%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50 p-[2px]">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 shadow-inner" style={{ width: "60%" }} />
              </div>
              <div className="bg-white/80 border border-pink-100 rounded-2xl p-3 mt-4 text-xs space-y-1 shadow-sm">
                <p className="font-bold text-rose-600">💡 Conseil MomyCare</p>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Votre bébé a la taille d'un melon d'Espagne. N'oubliez pas de boire beaucoup d'eau et de faire des étirements légers.
                </p>
              </div>
            </div>
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-5 space-y-6">
          <Card className="border-pink-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="border-b border-pink-50 pb-3">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <Calendar className="h-5 w-5 text-rose-500" />
                Prochain Rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeNextAppt ? (
                <div className="mt-5 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-500 shadow-inner">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black leading-tight text-gray-900">{activeNextAppt.doctor}</h3>
                      <Badge className="inline-block normal-case tracking-normal text-rose-600 bg-rose-50 border-rose-100">
                        {activeNextAppt.specialty}
                      </Badge>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        Type: <span className="font-medium text-gray-500">{activeNextAppt.type}</span>
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <Clock className="h-3.5 w-3.5 text-rose-400" />
                        <span>
                          {activeNextAppt.date} à {activeNextAppt.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => handleEditNextAppt(activeNextAppt)}
                      className="flex-1 h-auto rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-3.5 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600"
                    >
                      <Edit3 className="h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={openCancelModal}
                      className="flex-1 h-auto rounded-2xl border-rose-200 py-3.5 text-sm font-bold text-rose-500 hover:bg-rose-50/50 hover:border-rose-300"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-10 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">Vous n'avez aucun rendez-vous à venir.</p>
                  <Button
                    type="button"
                    onClick={openBookModal}
                    variant="ghost"
                    className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Prendre rendez-vous
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-pink-100 shadow-sm">
            <CardHeader className="border-b border-pink-50 pb-3">
              <CardTitle className="text-xl font-bold text-gray-900">⚡ Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="mt-1">
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Button
                type="button"
                onClick={openBookModal}
                className="h-auto flex-col rounded-2xl bg-rose-500 p-4 text-white shadow-md hover:bg-rose-600 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white mb-3 shadow-inner">
                  <Calendar className="h-6 w-6" />
                </div>
                <span className="text-sm font-extrabold tracking-tight">Prendre RDV</span>
                </Button>
                <Button
                type="button"
                onClick={openSearchModal}
                className="h-auto flex-col rounded-2xl bg-violet-600 p-4 text-white shadow-md hover:bg-violet-700 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white mb-3 shadow-inner">
                  <Search className="h-6 w-6" />
                </div>
                <span className="text-sm font-extrabold tracking-tight text-center leading-tight">Rechercher Médecin</span>
                </Button>
                <Button
                type="button"
                onClick={() => setActiveTab("dossier")}
                className="h-auto flex-col rounded-2xl bg-blue-600 p-4 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white mb-3 shadow-inner">
                  <FolderHeart className="h-6 w-6" />
                </div>
                <span className="text-sm font-extrabold tracking-tight">Consulter Dossier</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="lg:col-span-3 space-y-6">
          <Card className="border-pink-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="border-b border-pink-50 pb-3">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <FileText className="h-5 w-5 text-rose-500" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mt-6 space-y-6 border-l-2 border-rose-100 pl-4 text-sm">
                {pastAppointments.length > 0 ? (
                  pastAppointments.map((appt) => (
                    <div key={appt.id} className="relative space-y-1">
                      <span className="absolute -left-[23px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow">
                        <Check className="h-2.5 w-2.5 text-white stroke-[3px]" />
                      </span>
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-400">{appt.date}</p>
                      <h4 className="font-extrabold leading-tight text-gray-900">{appt.doctor}</h4>
                      <p className="text-xs font-medium text-gray-500">{appt.type}</p>
                      <Badge className="mt-1 border-pink-100/50 bg-pink-50 text-pink-600">Consultation</Badge>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-center text-xs font-semibold text-gray-400">Aucun antécédent trouvé.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
