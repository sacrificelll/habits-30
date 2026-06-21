"use client";

import { useEffect, useState } from "react";
import type { Habit, StreakState } from "@/lib/types";
import { loadState, saveState, clearState } from "@/lib/storage";
import { dateKey, pluralDays } from "@/lib/date";
import { advanceStreak, streakForDisplay } from "@/lib/streak";
import { MAX_HABITS } from "@/lib/presets";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitCard } from "@/components/HabitCard";
import { EmptyState } from "@/components/EmptyState";
import { StreakBadge } from "@/components/StreakBadge";
import { ResetButton } from "@/components/ResetButton";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [streak, setStreak] = useState<StreakState>({
    current: 0,
    best: 0,
    lastDay: null,
  });
  const [mounted, setMounted] = useState(false);

  // Загружаем данные из localStorage только на клиенте.
  useEffect(() => {
    const state = loadState();
    setHabits(state.habits);
    setStreak(state.streak);
    setMounted(true);
  }, []);

  // Сохраняем при любых изменениях — но только после первой загрузки.
  useEffect(() => {
    if (mounted) saveState({ habits, streak });
  }, [habits, streak, mounted]);

  const today = dateKey();
  const { current, best } = streakForDisplay(streak, today);
  const totalMarked = habits.reduce(
    (sum, habit) => sum + habit.completedDates.length,
    0,
  );

  function addHabit(data: { name: string; goalDays: number; color: string }) {
    setHabits((prev) => {
      if (prev.length >= MAX_HABITS) return prev;
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const habit: Habit = {
        id,
        name: data.name,
        goalDays: data.goalDays,
        color: data.color,
        createdAt: new Date().toISOString(),
        completedDates: [],
      };
      return [...prev, habit];
    });
  }

  function deleteHabit(id: string) {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  }

  // Меняет цель привычки (дни). На стрик не влияет.
  function updateGoal(id: string, goalDays: number) {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, goalDays } : habit)),
    );
  }

  // «Начать заново»: обнуляем отметки привычки и стартуем новые 30 дней с
  // сегодня. Стрик — отдельный счётчик, поэтому не трогается.
  function restartHabit(id: string) {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completedDates: [],
              createdAt: new Date().toISOString(),
            }
          : habit,
      ),
    );
  }

  // Полный сброс: чистим хранилище и состояние.
  function resetAll() {
    clearState();
    setHabits([]);
    setStreak({ current: 0, best: 0, lastDay: null });
  }

  // Отмечает/снимает выполнение привычки за конкретный день.
  function toggleDate(id: string, key: string) {
    const habit = habits.find((item) => item.id === id);
    const wasDone = habit ? habit.completedDates.includes(key) : false;

    setHabits((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const done = item.completedDates.includes(key);
        return {
          ...item,
          completedDates: done
            ? item.completedDates.filter((date) => date !== key)
            : [...item.completedDates, key],
        };
      }),
    );

    // Серию продлевает только новая отметка за СЕГОДНЯ. Снятие отметки и
    // правка прошлых дней на стрик не влияют.
    if (key === today && !wasDone) {
      setStreak((prev) => advanceStreak(prev, today));
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="h-7 w-2 rounded-full bg-hot-orange"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold tracking-tight text-cream">
              Habits <span className="text-hot-orange">30</span>
            </h1>
          </div>
          <StreakBadge streak={current} best={best} />
        </div>
        <div className="mt-3 rounded-xl border border-eerie-light bg-night/40 p-4">
          <p className="text-sm text-fog">
            Заведи до 5 привычек и отмечай их каждый день.
          </p>
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-orange-wheel/40 bg-orange-wheel/10 px-3 py-2.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-orange-wheel"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-sm leading-snug">
              <span className="font-semibold text-orange-wheel">
                Данные хранятся только в твоём браузере
              </span>
              <span className="text-cream/90">
                {" "}
                — на этом устройстве и нигде больше. Очистка истории или кэша
                браузера удалит прогресс.
              </span>
            </p>
          </div>
        </div>

        {mounted && habits.length > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-eerie-light bg-night/50 px-3 py-1.5 text-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4 text-moss"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-fog">
              Всего отмечено:{" "}
              <span className="font-semibold text-cream">{totalMarked}</span>{" "}
              {pluralDays(totalMarked)}
            </span>
          </div>
        )}
      </header>

      <div className="space-y-6">
        <AddHabitForm count={habits.length} onAdd={addHabit} />

        <section className="space-y-3">
          {!mounted ? null : habits.length === 0 ? (
            <EmptyState />
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onToggleDate={toggleDate}
                onDelete={deleteHabit}
                onUpdateGoal={updateGoal}
                onRestart={restartHabit}
              />
            ))
          )}
        </section>

        {mounted && habits.length > 0 && <ResetButton onReset={resetAll} />}
      </div>
    </main>
  );
}
