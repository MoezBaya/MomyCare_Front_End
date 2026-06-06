// src/hooks/useCalendarConfig.js
import { useMemo } from "react";

export function useCalendarConfig({ events, availabilities }) {
  const businessHours = useMemo(() => {
    // Transform availabilities into FullCalendar businessHours
    if (!availabilities.length) return [];
    return availabilities.map(slot => ({
      daysOfWeek: [slot.jourSemaine], // 1=Monday, 0=Sunday, adapt if needed
      startTime: slot.heureDebut,
      endTime: slot.heureFin,
    }));
  }, [availabilities]);

  const slotMinTime = "08:00";
  const slotMaxTime = "20:00";

  return { events, businessHours, slotMinTime, slotMaxTime };
}