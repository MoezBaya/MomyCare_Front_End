// 1. أولاً استورد core
import FullCalendar from '@fullcalendar/react'

// 2. ثم استورد plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'


export function AgendaCalendar({ events = [], onEventClick }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        events={events}
        eventClick={(info) => onEventClick?.(info.event.extendedProps)}
        eventColor="#f0f9ff"
        eventTextColor="#111827"
        eventBorderColor="#f9a8d4"
        height="auto"
        dayMaxEvents={3}
        buttonText={{ today: "Aujourd'hui", month: "Mois", week: "Semaine", day: "Jour" }}
      />
    </div>
  );
}
