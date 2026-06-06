import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import "@/css/agenda.css";

/* =========================================================
   LOCALE FRANÇAISE
========================================================= */
const frLocale = {
  code: "fr",
  week: { dow: 1, doy: 4 },
  buttonText: {
    prev: "Précédent",
    next: "Suivant",
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    list: "Liste",
  },
  weekText: "Semaine",
  allDayText: "Toute la journée",
  moreLinkText: "en plus",
  noEventsText: "Aucun événement",
};

/* =========================================================
   COMPOSANT PRINCIPAL
========================================================= */
export function AgendaCalendar({ events = [], availabilities = [], onEventClick }) {
  const availableDays = availabilities.map((slot) => mapDayToIndex(slot.jourSemaine));

  return (
    <Card className="overflow-hidden rounded-[28px] border border-[#ebe7f5] bg-white shadow-[0_18px_55px_rgba(76,60,170,0.07)]">
      <CardContent className="p-0">
        <div className="mc-agenda-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={frLocale}
            firstDay={1}
            height="auto"
            expandRows
            stickyHeaderDates
            // --- CORRECTION DES CRÉNEAUX HORAIRES ---
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            slotDuration="00:30:00"          // chaque créneau = 30 min
            slotLabelInterval="01:00:00"     // étiquette seulement toutes les heures (8:00, 9:00...)
            allDaySlot={false}
            nowIndicator
            eventMinHeight={68}
            editable
            selectable
            events={events}
            eventClick={onEventClick}
            // --- BUSINESS HOURS (disponibilités) ---
            businessHours={availabilities.map((slot) => ({
              daysOfWeek: [mapDayToIndex(slot.jourSemaine)],
              startTime: slot.heureDebut,
              endTime: slot.heureFin,
            }))}
            // --- JOURS FERMÉS ---
            dayCellClassNames={(arg) => {
              const day = arg.date.getDay();
              if (!availableDays.includes(day)) return ["mc-disabled-day"];
              return [];
            }}
            // --- BARRE D'OUTILS ---
            customButtons={{
              filters: { text: "Filtres", click: () => {} },
            }}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridDay,timeGridWeek,dayGridMonth filters",
            }}
            buttonText={{ today: "Aujourd'hui", month: "Mois", week: "Semaine", day: "Jour" }}
            // --- RENDU PERSONNALISÉ ---
            dayHeaderContent={renderDayHeader}
            eventContent={renderEventContent}   // fonction améliorée
            eventClassNames="mc-agenda-event"
            slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
            eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   ENTÊTE DES JOURS
========================================================= */
function renderDayHeader(args) {
  const weekday = args.date.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
  const date = args.date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }).replace(".", "");
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-2">
      <span className="text-[12px] font-black uppercase tracking-wide text-[#1e1b4b]">{weekday}</span>
      <span className="text-[13px] font-bold text-[#5b21b6]">{date}</span>
    </div>
  );
}

/* =========================================================
   RENDU DES ÉVÉNEMENTS (avec grand nom patiente)
========================================================= */
function renderEventContent(eventInfo) {
  const { event, timeText } = eventInfo;
  const typeLabel = event.extendedProps?.appointmentTypeLabel || event.extendedProps?.type || "Consultation";
  const isVideo = event.extendedProps?.isVideoConsult;
  const background = event.extendedProps?.background || "#ede9fe";
  const patientName = event.title || "Patiente";

  return (
    <div
      className="mc-event-inner"
      style={{ background }}
      title={`${patientName} – ${typeLabel}${isVideo ? " (Visio)" : ""}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[10px] font-black text-[#5b21b6]">{timeText}</span>
        {isVideo && <Video className="h-3 w-3 text-[#5b21b6]" />}
      </div>
      <div className="mt-1">
        <p className="text-sm font-extrabold leading-tight text-slate-800 line-clamp-2">
          {patientName}
        </p>
        <p className="text-[10px] font-semibold text-slate-600 line-clamp-2 mt-0.5">
          {typeLabel}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   HELPER : conversion jour en index (dimanche=0 ...)
========================================================= */
function mapDayToIndex(day) {
  switch (day) {
    case "SUNDAY": return 0;
    case "MONDAY": return 1;
    case "TUESDAY": return 2;
    case "WEDNESDAY": return 3;
    case "THURSDAY": return 4;
    case "FRIDAY": return 5;
    case "SATURDAY": return 6;
    default: return 1;
  }
}