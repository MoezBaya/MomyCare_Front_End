import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function MiniCalendar({ selectedDays = [], onDayClick }) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDay = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const renderDays = () => {
    const cells = [];
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      cells.push(
        <div key={`prev-${i}`} className="h-9 w-9 flex items-center justify-center text-[12px] text-[#d1d5db]">
          {prevMonthDays - i}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDays.includes(day);
      cells.push(
        <div
          key={day}
          onClick={() => onDayClick?.(day)}
          className={`h-9 w-9 flex items-center justify-center rounded-[10px] text-[12px] font-semibold cursor-pointer transition-all ${
            isSelected
              ? "bg-[#ede9fe] text-[#5b21b6]"
              : "text-[#1e1b4b] hover:bg-[#f5f3ff]"
          }`}
        >
          {day}
        </div>
      );
    }

    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push(
        <div key={`next-${i}`} className="h-9 w-9 flex items-center justify-center text-[12px] text-[#d1d5db]">
          {i}
        </div>
      );
    }

    return cells;
  };

  return (
    <Card className="rounded-[24px] border border-[#ebe7f5] bg-white shadow-[0_8px_30px_rgba(76,60,170,0.06)]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[#1e1b4b]">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="h-7 w-7 rounded-[8px] flex items-center justify-center hover:bg-[#f5f3ff]">
              <ChevronLeft className="h-4 w-4 text-[#8b87b0]" />
            </button>
            <button onClick={nextMonth} className="h-7 w-7 rounded-[8px] flex items-center justify-center hover:bg-[#f5f3ff]">
              <ChevronRight className="h-4 w-4 text-[#8b87b0]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {days.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-[11px] font-bold text-[#8b87b0]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">{renderDays()}</div>
      </CardContent>
    </Card>
  );
}