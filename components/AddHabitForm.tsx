"use client";

import { useState } from "react";
import {
  HABIT_PRESETS,
  HABIT_COLORS,
  MAX_HABITS,
  MIN_GOAL,
  MAX_GOAL,
  DEFAULT_GOAL,
} from "@/lib/presets";

interface AddHabitFormProps {
  count: number;
  onAdd: (data: { name: string; goalDays: number; color: string }) => void;
}

export function AddHabitForm({ count, onAdd }: AddHabitFormProps) {
  const [name, setName] = useState("");
  const [goalDays, setGoalDays] = useState(DEFAULT_GOAL);
  const [color, setColor] = useState(HABIT_COLORS[0]);

  const limitReached = count >= MAX_HABITS;
  const canAdd = name.trim().length > 0 && !limitReached;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canAdd) return;
    onAdd({ name: name.trim(), goalDays, color });
    setName("");
    setColor(HABIT_COLORS[0]);
    setGoalDays(DEFAULT_GOAL);
  }

  return (
    <section className="rounded-2xl border border-eerie-light bg-eerie p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-fog">Быстрый выбор</p>
        <span className="text-xs text-fog">
          {count}/{MAX_HABITS}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2.5">
        {HABIT_PRESETS.map((preset) => {
          const active = name === preset.label;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => setName(preset.label)}
              disabled={limitReached}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? "border-hot-orange bg-hot-orange/10 text-hot-orange"
                  : "border-eerie-light bg-night text-cream hover:border-hot-orange hover:text-hot-orange"
              }`}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {preset.icon}
              </span>
              {preset.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="habit-name" className="mb-1.5 block text-sm text-fog">
            Своя привычка
          </label>
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={limitReached}
            maxLength={40}
            autoComplete="off"
            placeholder="Например: бегать по утрам"
            className="w-full rounded-xl border border-eerie-light bg-night px-4 py-2.5 text-cream outline-none transition-colors placeholder:text-fog/60 focus:border-hot-orange disabled:opacity-40"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="sm:w-44">
            <label
              htmlFor="habit-goal"
              className="mb-1.5 block text-sm text-fog"
            >
              Цель, дней ({MIN_GOAL}–{MAX_GOAL})
            </label>
            <input
              id="habit-goal"
              type="number"
              min={MIN_GOAL}
              max={MAX_GOAL}
              value={goalDays}
              onChange={(event) => {
                const value = Number(event.target.value);
                setGoalDays(Number.isNaN(value) ? DEFAULT_GOAL : value);
              }}
              onBlur={() =>
                setGoalDays((value) =>
                  Math.min(MAX_GOAL, Math.max(MIN_GOAL, value)),
                )
              }
              disabled={limitReached}
              className="w-full rounded-xl border border-eerie-light bg-night px-4 py-2.5 text-cream outline-none transition-colors focus:border-hot-orange disabled:opacity-40"
            />
          </div>

          <div className="flex-1">
            <span className="mb-1.5 block text-sm text-fog">Цвет</span>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setColor(value)}
                  disabled={limitReached}
                  aria-label={`Выбрать цвет ${value}`}
                  className={`h-8 w-8 rounded-full transition-transform hover:scale-110 disabled:opacity-40 ${
                    color === value
                      ? "ring-2 ring-cream ring-offset-2 ring-offset-eerie"
                      : ""
                  }`}
                  style={{ backgroundColor: value }}
                />
              ))}
            </div>
          </div>
        </div>

        {limitReached ? (
          <p className="text-sm text-orange-wheel">
            Достигнут лимит в {MAX_HABITS} привычек. Удалите одну, чтобы добавить
            новую.
          </p>
        ) : (
          <button
            type="submit"
            disabled={!canAdd}
            className="w-full rounded-xl bg-hot-orange px-4 py-2.5 font-semibold text-cream transition-colors hover:bg-orange-wheel disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Добавить привычку
          </button>
        )}
      </form>
    </section>
  );
}
