// src/components/dashboard/doctor/views/AgendaView.jsx
import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";

export default function AgendaView() {
  const { allAppointments = [], isLoadingData } = useDoctorDashboard();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month, week, day
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- Rendez-vous filtrés pour la sidebar ---
  const rdvsOfSelectedDay = useMemo(() => {
    return allAppointments.filter((rdv) =>
      isSameDay(new Date(rdv.dateRendezVous), selectedDate)
    );
  }, [allAppointments, selectedDate]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return allAppointments
      .filter((rdv) => new Date(rdv.dateRendezVous) >= now)
      .sort((a, b) => new Date(a.dateRendezVous) - new Date(b.dateRendezVous))
      .slice(0, 5);
  }, [allAppointments]);

  // Navigation
  const goPrev = () => {
    if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
    if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    if (viewMode === "day") setCurrentDate(addDays(currentDate, -1));
  };
  const goNext = () => {
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
    if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
  };
  const goToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // --- VUE MOIS (avec RDV dans les cases) ---
  const renderMonthView = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    return (
      <Card className="rounded-3xl border border-pink-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goPrev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-lg font-bold capitalize">
              {format(currentDate, "MMMM yyyy", { locale: fr })}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={goNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToday} className="rounded-2xl">
            Aujourd’hui
          </Button>
        </CardHeader>
        <CardContent>
          {/* Grille des noms de jours */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-3">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayRdv = allAppointments.filter((rdv) =>
                isSameDay(new Date(rdv.dateRendezVous), day)
              );
              const isSelectedDay = isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-24 p-1 rounded-xl text-left transition-all
                    ${!isSameMonth(day, currentDate) ? "bg-gray-50 text-gray-300" : "bg-white hover:bg-rose-50"}
                    ${isSelectedDay ? "ring-2 ring-rose-400 bg-rose-50" : ""}
                    ${isToday(day) && !isSelectedDay ? "border border-rose-200" : ""}
                  `}
                >
                  <span className="inline-block text-sm font-semibold px-1.5 py-0.5 rounded-full">
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayRdv.slice(0, 3).map((rdv) => (
                      <div
                        key={rdv.id}
                        className="text-[10px] truncate px-1 py-0.5 rounded-md bg-rose-100 text-rose-700 font-medium"
                      >
                        {rdv.patient?.split(" ")[0]} • {rdv.type?.slice(0, 14)}
                      </div>
                    ))}
                    {dayRdv.length > 3 && (
                      <div className="text-[9px] text-gray-400 pl-1">+{dayRdv.length - 3}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // --- VUE SEMAINE (créneaux horaires horizontaux, comme la maquette) ---
  const renderWeekView = () => {
    const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i));
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8h à 20h

    return (
      <Card className="rounded-3xl border border-pink-100 shadow-sm overflow-x-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goPrev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-base font-bold">
              Semaine du {format(weekDays[0], "dd MMM", { locale: fr })} au{" "}
              {format(weekDays[6], "dd MMM yyyy", { locale: fr })}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={goNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToday} className="rounded-2xl">
            Aujourd’hui
          </Button>
        </CardHeader>
        <CardContent>
          <div className="min-w-[800px]">
            {/* Entêtes des jours */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-sm font-semibold text-gray-500 p-2">Heure</div>
              {weekDays.map((day) => (
                <div key={day.toString()} className="text-center text-sm font-semibold p-2">
                  {format(day, "EEEE d", { locale: fr })}
                  <br />
                  {isToday(day) && <span className="text-xs text-rose-500">(auj.)</span>}
                </div>
              ))}
            </div>
            {/* Lignes horaires */}
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 gap-1 border-t border-pink-100 py-1">
                <div className="text-xs text-gray-400 p-2 text-right">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                {weekDays.map((day) => {
                  const rdvAtHour = allAppointments.find(
                    (rdv) =>
                      isSameDay(new Date(rdv.dateRendezVous), day) &&
                      new Date(rdv.dateRendezVous).getHours() === hour
                  );
                  return (
                    <div key={`${day}-${hour}`} className="min-h-16 p-1">
                      {rdvAtHour && (
                        <div
                          className="rounded-lg bg-rose-50 p-1 text-xs cursor-pointer hover:bg-rose-100 transition"
                          onClick={() => setSelectedDate(day)}
                        >
                          <p className="font-semibold truncate">{rdvAtHour.patient}</p>
                          <p className="text-[10px] text-gray-500 truncate">{rdvAtHour.type}</p>
                          <Badge
                            variant={rdvAtHour.status === "Confirmé" ? "success" : "warning"}
                            className="mt-1 text-[9px]"
                          >
                            {rdvAtHour.status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // --- VUE JOUR (liste verticale des RDV par heure) ---
  const renderDayView = () => {
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);
    return (
      <Card className="rounded-3xl border border-pink-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goPrev}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-lg font-bold capitalize">
              {format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={goNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToday} className="rounded-2xl">
            Aujourd’hui
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {hours.map((hour) => {
            const rdvAtHour = allAppointments.find(
              (rdv) =>
                isSameDay(new Date(rdv.dateRendezVous), currentDate) &&
                new Date(rdv.dateRendezVous).getHours() === hour
            );
            return (
              <div key={hour} className="flex items-start gap-4 border-b border-pink-100 py-2">
                <div className="w-20 text-sm font-semibold text-gray-500">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                <div className="flex-1">
                  {rdvAtHour ? (
                    <div className="rounded-xl bg-rose-50 p-3">
                      <p className="font-bold text-gray-800">{rdvAtHour.patient}</p>
                      <p className="text-sm text-gray-600">{rdvAtHour.type}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant={rdvAtHour.status === "Confirmé" ? "success" : "warning"}>
                          {rdvAtHour.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          Détails
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">Libre</div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Chargement de l’agenda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec les boutons de vue */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Agenda</h1>
          <p className="text-sm text-gray-500">Gérez votre planning et vos rendez‑vous</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            onClick={() => setViewMode("month")}
            className="rounded-2xl"
          >
            Mois
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            onClick={() => setViewMode("week")}
            className="rounded-2xl"
          >
            Semaine
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            onClick={() => setViewMode("day")}
            className="rounded-2xl"
          >
            Jour
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Zone principale : calendrier selon la vue */}
        <div className="lg:col-span-2">
          {viewMode === "month" && renderMonthView()}
          {viewMode === "week" && renderWeekView()}
          {viewMode === "day" && renderDayView()}
        </div>

        {/* Sidebar droite : RDV du jour + Prochains RDV + légende */}
        <div className="space-y-6">
          {/* RDV du jour sélectionné */}
          <Card className="rounded-3xl border border-pink-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5 text-rose-500" />
                Rendez-vous du {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rdvsOfSelectedDay.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun rendez-vous ce jour.</p>
              ) : (
                rdvsOfSelectedDay.map((rdv) => (
                  <div
                    key={rdv.id}
                    className="flex items-center justify-between rounded-2xl border border-pink-100 p-3 hover:bg-rose-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-rose-100 p-2">
                        <Clock className="h-4 w-4 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(rdv.dateRendezVous).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="text-sm text-gray-700">{rdv.patient}</p>
                        <p className="text-xs text-gray-500">{rdv.type}</p>
                      </div>
                    </div>
                    <Badge variant={rdv.status === "Confirmé" ? "success" : "warning"} className="rounded-full">
                      {rdv.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Prochains rendez-vous */}
          <Card className="rounded-3xl border border-pink-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Prochains rendez-vous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-gray-400">Aucun rendez-vous à venir.</p>
              ) : (
                upcomingAppointments.map((rdv) => (
                  <div
                    key={rdv.id}
                    className="flex items-center gap-3 rounded-2xl border border-pink-50 bg-rose-50/30 p-3"
                  >
                    <div className="rounded-full bg-rose-100 p-2">
                      <Clock className="h-4 w-4 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(rdv.dateRendezVous).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-xs text-gray-500">{rdv.type}</p>
                    </div>
                    <Badge variant={rdv.status === "Confirmé" ? "success" : "warning"} className="rounded-full text-[10px]">
                      {rdv.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Légende */}
          <Card className="rounded-3xl border border-pink-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Consultation</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400"></span> Suivi de grossesse</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400"></span> Résultats / Examens</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-400"></span> Contraception</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-400"></span> Téléconsultation</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}