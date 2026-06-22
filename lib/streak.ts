import type { Habit, StreakState } from "./types";
import { dateKey } from "./date";

/** Сдвигает дату-ключ на `delta` дней (вперёд/назад). */
function shiftDay(key: string, delta: number): string {
  const [year, month, day] = key.split("-").map(Number);
  return dateKey(new Date(year, month - 1, day + delta));
}

/**
 * Общий «стрик»: сколько дней подряд (заканчивая сегодня или вчера) была
 * отмечена хотя бы одна привычка. Не привязан к конкретной привычке.
 *
 * Грейс-период в один день: если сегодня ещё не отмечено, но вчера было —
 * стрик жив (у пользователя есть весь день, чтобы продолжить). Если пропущены
 * и сегодня, и вчера — стрик равен 0.
 */
function computeCurrentStreak(habits: Habit[], today: string): number {
  const active = new Set<string>();
  for (const habit of habits) {
    for (const date of habit.completedDates) active.add(date);
  }
  if (active.size === 0) return 0;

  const [year, month, day] = today.split("-").map(Number);
  let cursor: Date;

  if (active.has(today)) {
    cursor = new Date(year, month - 1, day);
  } else {
    const yesterday = new Date(year, month - 1, day - 1);
    if (!active.has(dateKey(yesterday))) return 0;
    cursor = yesterday;
  }

  let streak = 0;
  while (active.has(dateKey(cursor))) {
    streak += 1;
    cursor = new Date(
      cursor.getFullYear(),
      cursor.getMonth(),
      cursor.getDate() - 1,
    );
  }
  return streak;
}

/** true, если `currKey` — это календарный день, следующий сразу за `prevKey`. */
function isNextDay(prevKey: string, currKey: string): boolean {
  const [year, month, day] = prevKey.split("-").map(Number);
  return dateKey(new Date(year, month - 1, day + 1)) === currKey;
}

/**
 * Лучший «стрик» за всё время: самая длинная серия календарных дней подряд,
 * в которые была отмечена хотя бы одна привычка. Та же модель, что и у
 * текущего стрика, но без грейс-периода — это просто рекорд по истории.
 */
function computeBestStreak(habits: Habit[]): number {
  const active = new Set<string>();
  for (const habit of habits) {
    for (const date of habit.completedDates) active.add(date);
  }
  if (active.size === 0) return 0;

  // Ключи YYYY-MM-DD сортируются по строке как по дате.
  const sorted = [...active].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    run = isNextDay(sorted[i - 1], sorted[i]) ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
}

/**
 * Продлевает «живой» стрик сегодняшней отметкой. Вызывается, когда пользователь
 * отмечает любую привычку за СЕГОДНЯ. Идемпотентно в пределах одного дня:
 * вторая отметка за тот же день серию не накручивает.
 */
export function advanceStreak(streak: StreakState, today: string): StreakState {
  if (streak.lastDay === today) return streak;
  const continued = streak.lastDay === shiftDay(today, -1);
  const current = continued ? streak.current + 1 : 1;
  return {
    current,
    best: Math.max(streak.best, current),
    lastDay: today,
  };
}

/**
 * Значения для показа. Серия «жива», если последняя отметка была сегодня или
 * вчера (есть весь сегодняшний день, чтобы продолжить). Если пропущены целые
 * сутки — текущая серия показывается как 0, рекорд сохраняется.
 */
export function streakForDisplay(
  streak: StreakState,
  today: string,
): { current: number; best: number } {
  const alive =
    streak.lastDay === today || streak.lastDay === shiftDay(today, -1);
  return { current: alive ? streak.current : 0, best: streak.best };
}

/**
 * Восстанавливает стрик из истории отметок — разово, для старых данных без
 * сохранённого стрика. Дальше серия живёт уже по «живой» модели.
 */
export function deriveStreakFromHistory(
  habits: Habit[],
  today: string,
): StreakState {
  const active = new Set<string>();
  for (const habit of habits) {
    for (const date of habit.completedDates) active.add(date);
  }
  let lastDay: string | null = null;
  if (active.has(today)) lastDay = today;
  else if (active.has(shiftDay(today, -1))) lastDay = shiftDay(today, -1);

  return {
    current: computeCurrentStreak(habits, today),
    best: computeBestStreak(habits),
    lastDay,
  };
}
