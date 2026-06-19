"use client";

import { useEffect, useState } from "react";
import type { Habit } from "@/lib/types";
import { loadState, saveState } from "@/lib/storage";
import { dateKey } from "@/lib/date";
import { computeCurrentStreak } from "@/lib/streak";
import { MAX_HABITS } from "@/lib/presets";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitCard } from "@/components/HabitCard";
import { EmptyState } from "@/components/EmptyState";
import { StreakBadge } from "@/components/StreakBadge";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);

  // Загружаем данные из localStorage только на клиенте.
  useEffect(() => {
    setHabits(loadState().habits);
    setMounted(true);
  }, []);

  // Сохраняем при любых изменениях — но только после первой загрузки.
  useEffect(() => {
    if (mounted) saveState({ habits });
  }, [habits, mounted]);

  const today = dateKey();
  const streak = computeCurrentStreak(habits, today);

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

  // Отмечает/снимает выполнение привычки за конкретный день.
  function toggleDate(id: string, key: string) {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        const done = habit.completedDates.includes(key);
        return {
          ...habit,
          completedDates: done
            ? habit.completedDates.filter((date) => date !== key)
            : [...habit.completedDates, key],
        };
      }),
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className="h-7 w-2 rounded-full bg-hot-orange"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-bold tracking-tight text-cream">
              Habits <span className="text-hot-orange">30</span>
            </h1>
          </div>
          <p className="mt-2 text-sm text-fog">
            Заведи до 5 привычек и отмечай их каждый день. Данные хранятся только
            в твоём браузере.
          </p>
        </div>
        <StreakBadge streak={streak} />
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
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
