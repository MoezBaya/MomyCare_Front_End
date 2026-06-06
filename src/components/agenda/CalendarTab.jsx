import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
  Video,
} from "lucide-react";
import { AgendaCalendar } from "./AgendaCalendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LEGEND_ITEMS } from "@/constants/AgendaConstants";

const MONTH_DAYS = [
  ["29", "30", "01", "02", "03", "04", "05"],
  ["06", "07", "08", "09", "10", "11", "12"],
  ["13", "14", "15", "16", "17", "18", "19"],
  ["20", "21", "22", "23", "24", "25", "26"],
  ["27", "28", "29", "30", "31", "01", "02"],
  ["03", "04", "05", "06", "07", "08", "09"],
];

export function CalendarTab({ events, selectedEvent, onEventClick }) {
  const [query, setQuery] = useState("");

  const filteredEvents = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return events;
    return events.filter((event) => {
      const haystack = `${event.title || ""} ${event.extendedProps?.type || ""} ${event.extendedProps?.appointmentTypeLabel || ""}`.toLowerCase();
      return haystack.includes(value);
    });
  }, [events, query]);

  const nextEvent = useMemo(() => {
    const now = Date.now();
    return [...events]
      .filter((event) => new Date(event.start).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0] || events[0];
  }, [events]);

  return (
    <section className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-[1580px] space-y-6">
      <AgendaTopBar query={query} onQueryChange={setQuery} />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(820px,1fr)_360px]">
        <AgendaCalendar events={filteredEvents} onEventClick={onEventClick} />
        <aside className="space-y-6">
          <MiniMonth />
          <NextAppointmentCard event={selectedEvent || nextEvent} />
          <LegendCard />
        </aside>
      </div>
      <p className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-900/60">
        <FileText className="h-3.5 w-3.5" />
        Donnees securisees et confidentielles
      </p>
    </section>
  );
}

function AgendaTopBar({ query, onQueryChange }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-[22px] font-black leading-none text-indigo-950">Agenda</h1>
        <p className="mt-2 text-sm font-medium text-indigo-900/60">Gerez votre planning et vos rendez-vous</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-[310px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-900/40" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Rechercher une patiente..."
            className="h-11 w-full rounded-xl border border-[#ebe7f5] bg-white pl-11 pr-4 text-sm font-semibold text-indigo-950 shadow-[0_10px_30px_rgba(50,42,110,0.04)] outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />
        </div>
        <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-[#ebe7f5] bg-white text-indigo-950 shadow-[0_10px_30px_rgba(50,42,110,0.04)]">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white" />
        </button>
        <Button className="h-11 rounded-xl bg-[#6d3ee8] px-5 text-sm font-bold text-white shadow-[0_12px_25px_rgba(109,62,232,0.25)] hover:bg-[#5b2fd6]">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle consultation
        </Button>
      </div>
    </div>
  );
}

function MiniMonth() {
  return (
    <Card className="min-h-[320px] rounded-2xl border-[#ebe7f5] bg-white shadow-[0_18px_55px_rgba(50,42,110,0.06)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-indigo-950">Mai 2024</h2>
          <div className="flex gap-1">
            <button className="grid h-8 w-8 place-items-center rounded-lg text-indigo-950 hover:bg-violet-50"><ChevronLeft className="h-4 w-4" /></button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-indigo-950 hover:bg-violet-50"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-bold text-indigo-900/50">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="mt-4 grid gap-1 text-center text-sm font-semibold text-indigo-950">
          {MONTH_DAYS.map((week, index) => (
            <div key={index} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => {
                const active = ["02", "03", "04", "05"].includes(day) && index === 0;
                const muted = (index === 0 && dayIndex < 2) || index > 4 || (index === 4 && dayIndex > 4);
                return (
                  <span key={`${index}-${dayIndex}`} className={`grid h-8 place-items-center rounded-lg ${active ? "bg-violet-100 text-violet-700" : muted ? "text-indigo-900/30" : ""}`}>
                    {day}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NextAppointmentCard({ event }) {
  const date = event?.start ? new Date(event.start) : null;
  const time = date ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--";
  const type = event?.extendedProps?.appointmentTypeLabel || event?.extendedProps?.type || "Consultation gynecologique";

  return (
    <Card className="rounded-2xl border-[#ebe7f5] bg-white shadow-[0_18px_55px_rgba(50,42,110,0.06)]">
      <CardContent className="p-6">
        <h2 className="text-sm font-black text-indigo-950">Prochain rendez-vous</h2>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-violet-600"><Clock3 className="h-4 w-4" /></span>
            <span className="text-lg font-black text-indigo-950">{time}</span>
          </div>
          <span className="rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-black text-violet-600">En cours</span>
        </div>
        <div className="mt-6 flex gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink-100 to-violet-100 text-base font-black text-violet-700">
            {(event?.title || "P").slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-indigo-950">{event?.title || "Aucun rendez-vous"}</p>
            <p className="mt-1 text-xs font-semibold text-indigo-900/50">{type}</p>
          </div>
        </div>
        <Button className="mt-6 h-11 w-full rounded-xl bg-[#6d3ee8] text-sm font-bold text-white shadow-[0_12px_25px_rgba(109,62,232,0.22)] hover:bg-[#5b2fd6]">
          Ouvrir le dossier
        </Button>
      </CardContent>
    </Card>
  );
}

function LegendCard() {
  return (
    <Card className="rounded-2xl border-[#ebe7f5] bg-white shadow-[0_18px_55px_rgba(50,42,110,0.06)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-indigo-950">Legende</h2>
          <SlidersHorizontal className="h-4 w-4 text-indigo-900/40" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3.5">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs font-semibold text-indigo-950/75">
              <LegendMark item={item} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-6 h-10 w-full rounded-xl border-[#ebe7f5] text-xs font-bold text-indigo-950 hover:bg-violet-50">
          <Download className="mr-2 h-4 w-4 text-violet-600" /> Exporter l'agenda
        </Button>
      </CardContent>
    </Card>
  );
}

function LegendMark({ item }) {
  if (item.shape === "line") return <span className="h-0.5 w-5 rounded-full" style={{ backgroundColor: item.color }} />;
  if (item.shape === "check") return <CheckCircle2 className="h-4 w-4" style={{ color: item.color }} />;
  if (item.shape === "clock") return <Clock3 className="h-4 w-4" style={{ color: item.color }} />;
  if (item.shape === "note") return <FileText className="h-4 w-4" style={{ color: item.color }} />;
  if (item.label === "Teleconsultation") return <Video className="h-4 w-4" style={{ color: item.color }} />;
  return <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />;
}
