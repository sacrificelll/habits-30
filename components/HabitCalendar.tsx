"use client";

import { buildDayRange, dateKey, pluralDays } from "@/lib/date";

interface HabitCalendarProps {
  color: string;
  createdAt: string;
  goalDays: number;
  completedDates: string[];
  today: string;
  onToggleDate: (date: string) => void;
}

export function HabitCalendar({
  color,
  createdAt,
  goalDays,
  completedDates,
  today,
  onToggleDate,
}: HabitCalendarProps) {
  const startKey = dateKey(new Date(createdAt));
  const days = buildDayRange(startKey, goalDays);
  const doneSet = new Set(completedDates);

  return (
    <div className="mt-4 border-t border-eerie-light pt-4">
      <p className="mb-3 text-xs text-fog">
        Прогресс за {goalDays} {pluralDays(goalDays)} — нажми на день, чтобы
        отметить
      </p>
      <div className="grid grid-cols-[repeat(6,minmax(0,2.75rem))] justify-center gap-2">
        {days.map((day, index) => {
          const done = doneSet.has(day);
          const isToday = day === today;
          const isFuture = day > today;

          return (
            <button
              key={day}
              type="button"
              disabled={isFuture}
              onClick={() => onToggleDate(day)}
              title={day}
              aria-label={`День ${index + 1}${done ? ", выполнено" : ""}`}
              aria-pressed={done}
              className={`flex aspect-square items-center justify-center rounded-md border text-sm font-semibold transition-colors ${
                isFuture
                  ? "cursor-not-allowed border-transparent bg-night/60 text-fog/45"
                  : done
                    ? "border-transparent text-smoky"
                    : "border-eerie-light bg-night text-cream/70 hover:border-fog hover:text-cream"
              } ${
                isToday
                  ? "ring-2 ring-cream ring-offset-2 ring-offset-eerie"
                  : ""
              }`}
              style={done ? { backgroundColor: color } : undefined}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
