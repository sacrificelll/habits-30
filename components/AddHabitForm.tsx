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
  const [goalInput, setGoalInput] = useState(String(DEFAULT_GOAL));
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [confirming, setConfirming] = useState(false);

  const limitReached = count >= MAX_HABITS;
  const trimmedName = name.trim();
  const canAdd = trimmedName.length > 0 && !limitReached;

  // Любое изменение полей выводит из режима подтверждения.
  function setNameSafe(value: string) {
    setName(value);
    setConfirming(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canAdd) return;
    setConfirming(true); // не добавляем сразу — сначала подтверждение
  }

  function confirmAdd() {
    if (!canAdd) return;
    const parsed = parseInt(goalInput, 10);
    const goalDays = Number.isFinite(parsed)
      ? Math.min(MAX_GOAL, Math.max(MIN_GOAL, parsed))
      : DEFAULT_GOAL;
    onAdd({ name: trimmedName, goalDays, color });
    setName("");
    setColor(HABIT_COLORS[0]);
    setGoalInput(String(DEFAULT_GOAL));
    setConfirming(false);
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
              onClick={() => setNameSafe(preset.label)}
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
            onChange={(event) => setNameSafe(event.target.value)}
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
              inputMode="numeric"
              min={MIN_GOAL}
              max={MAX_GOAL}
              value={goalInput}
              onChange={(event) => {
                setGoalInput(event.target.value);
                setConfirming(false);
              }}
              onBlur={() => {
                const parsed = parseInt(goalInput, 10);
                const clamped = Number.isFinite(parsed)
                  ? Math.min(MAX_GOAL, Math.max(MIN_GOAL, parsed))
                  : DEFAULT_GOAL;
                setGoalInput(String(clamped));
              }}
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
                  onClick={() => {
                    setColor(value);
                    setConfirming(false);
                  }}
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
        ) : confirming ? (
          <div className="space-y-3 rounded-xl border border-hot-orange/40 bg-night p-4">
            <p className="text-sm text-cream">
              Добавить привычку{" "}
              <span className="font-semibold text-hot-orange">
                «{trimmedName}»
              </span>
              ?
            </p>
            <p className="text-xs text-fog">
              ⚠️ Название потом изменить будет нельзя.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={confirmAdd}
                className="rounded-xl bg-hot-orange px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-orange-wheel"
              >
                Да, добавить
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-xl border border-eerie-light px-4 py-2 text-sm text-fog transition-colors hover:text-cream"
              >
                Отмена
              </button>
            </div>
          </div>
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
