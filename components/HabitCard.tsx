"use client";

import { useState } from "react";
import type { Habit } from "@/lib/types";
import { pluralDays } from "@/lib/date";
import { HabitCalendar } from "./HabitCalendar";

interface HabitCardProps {
  habit: Habit;
  today: string;
  onToggleDate: (id: string, date: string) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({
  habit,
  today,
  onToggleDate,
  onDelete,
}: HabitCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const daysDone = habit.completedDates.length;
  const remaining = Math.max(0, habit.goalDays - daysDone);
  const reached = remaining === 0;
  const percent = Math.min(100, Math.round((daysDone / habit.goalDays) * 100));
  const doneToday = habit.completedDates.includes(today);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-eerie-light bg-eerie">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: habit.color }}
      />

      <div className="p-5 pl-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-cream">{habit.name}</h3>
            <p className="mt-1 text-xs text-fog">
              {reached
                ? `Цель: ${habit.goalDays} ${pluralDays(habit.goalDays)} · выполнено 🎉`
                : `Цель: ${habit.goalDays} ${pluralDays(habit.goalDays)} · осталось ${remaining} ${pluralDays(remaining)}`}
            </p>
          </div>
          <span
            className="shrink-0 text-sm font-bold tabular-nums text-cream"
            title="Выполнено от цели"
          >
            {percent}%
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleDate(habit.id, today)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              doneToday
                ? "bg-moss/20 text-moss"
                : "bg-night text-cream hover:bg-eerie-light"
            }`}
          >
            {doneToday ? "✓ Отмечено сегодня" : "Отметить сегодня"}
          </button>

          {confirming ? (
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDelete(habit.id)}
                className="rounded-xl bg-hot-orange px-3 py-2 text-sm font-medium text-cream transition-colors hover:bg-orange-wheel"
              >
                Удалить
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-xl border border-eerie-light px-3 py-2 text-sm text-fog transition-colors hover:text-cream"
              >
                Отмена
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label="Удалить привычку"
              className="rounded-xl border border-eerie-light px-3 py-2 text-sm text-fog transition-colors hover:border-hot-orange hover:text-hot-orange"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-eerie-light bg-night/40 py-2 text-sm font-medium text-fog transition-colors hover:border-fog hover:text-cream"
        >
          <span
            aria-hidden="true"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            ⌄
          </span>
          {expanded ? "Свернуть календарь" : "Отметить прошлые дни"}
        </button>

        {expanded && (
          <HabitCalendar
            color={habit.color}
            createdAt={habit.createdAt}
            completedDates={habit.completedDates}
            today={today}
            onToggleDate={(date) => onToggleDate(habit.id, date)}
          />
        )}
      </div>
    </div>
  );
}
