"use client";

import { useState } from "react";
import type { Habit } from "@/lib/types";
import { pluralDays } from "@/lib/date";
import { MIN_GOAL, MAX_GOAL } from "@/lib/presets";
import { HabitCalendar } from "./HabitCalendar";

/** #RRGGBB → rgba(...) — для лёгкой подсветки кнопок под цвет привычки. */
function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  if (value.length !== 6) return "transparent";
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface HabitCardProps {
  habit: Habit;
  today: string;
  onToggleDate: (id: string, date: string) => void;
  onDelete: (id: string) => void;
  onUpdateGoal: (id: string, goalDays: number) => void;
  onRestart: (id: string) => void;
}

export function HabitCard({
  habit,
  today,
  onToggleDate,
  onDelete,
  onUpdateGoal,
  onRestart,
}: HabitCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(habit.goalDays);
  const [restartConfirming, setRestartConfirming] = useState(false);

  const daysDone = habit.completedDates.length;
  const remaining = Math.max(0, habit.goalDays - daysDone);
  const reached = remaining === 0;
  const percent = Math.min(100, Math.round((daysDone / habit.goalDays) * 100));
  const doneToday = habit.completedDates.includes(today);

  // Кнопки управления — в цвет выбранной привычки (рамка + лёгкая подсветка).
  const chipStyle = {
    borderColor: habit.color,
    color: habit.color,
    backgroundColor: hexToRgba(habit.color, 0.12),
  };

  function saveGoal() {
    const value = Math.min(MAX_GOAL, Math.max(MIN_GOAL, Math.round(goalDraft)));
    onUpdateGoal(habit.id, value);
    setEditingGoal(false);
  }

  function confirmRestart() {
    onRestart(habit.id);
    setRestartConfirming(false);
    setEditingGoal(false);
  }

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

        {restartConfirming ? (
          <div className="mt-4 rounded-xl border border-hot-orange/40 bg-night p-4">
            <p className="text-sm text-cream">
              Сбросить отметки этой привычки и начать новые 30 дней?
            </p>
            <p className="mt-1 text-xs text-fog">
              Серия (стрик) не пострадает — обнулится только эта привычка.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={confirmRestart}
                className="rounded-xl bg-hot-orange px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-orange-wheel"
              >
                Да, начать заново
              </button>
              <button
                type="button"
                onClick={() => setRestartConfirming(false)}
                className="rounded-xl border border-eerie-light px-4 py-2 text-sm text-fog transition-colors hover:text-cream"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : reached ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-moss/30 bg-moss/10 px-4 py-2.5">
            <span className="text-sm text-cream">🎉 Цель достигнута!</span>
            <button
              type="button"
              onClick={() => setRestartConfirming(true)}
              className="shrink-0 rounded-lg bg-moss/20 px-3 py-1.5 text-sm font-medium text-moss transition-colors hover:bg-moss/30"
            >
              Начать заново
            </button>
          </div>
        ) : null}

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
          <>
            <HabitCalendar
              color={habit.color}
              createdAt={habit.createdAt}
              completedDates={habit.completedDates}
              today={today}
              onToggleDate={(date) => onToggleDate(habit.id, date)}
            />

            <div className="mt-4 border-t border-eerie-light pt-4">
              {editingGoal ? (
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    htmlFor={`goal-${habit.id}`}
                    className="text-xs text-fog"
                  >
                    Цель, дней ({MIN_GOAL}–{MAX_GOAL}):
                  </label>
                  <input
                    id={`goal-${habit.id}`}
                    type="number"
                    min={MIN_GOAL}
                    max={MAX_GOAL}
                    value={goalDraft}
                    onChange={(event) => setGoalDraft(Number(event.target.value))}
                    className="w-20 rounded-lg border border-eerie-light bg-night px-3 py-1.5 text-sm text-cream outline-none transition-colors focus:border-hot-orange"
                  />
                  <button
                    type="button"
                    onClick={saveGoal}
                    className="rounded-lg bg-hot-orange px-3 py-1.5 text-sm font-medium text-cream transition-colors hover:bg-orange-wheel"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGoal(false);
                      setGoalDraft(habit.goalDays);
                    }}
                    className="rounded-lg border border-eerie-light px-3 py-1.5 text-sm text-fog transition-colors hover:text-cream"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGoalDraft(habit.goalDays);
                      setEditingGoal(true);
                    }}
                    style={chipStyle}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:brightness-125"
                  >
                    Изменить цель
                  </button>
                  <button
                    type="button"
                    onClick={() => setRestartConfirming(true)}
                    style={chipStyle}
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:brightness-125"
                  >
                    Начать заново
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
