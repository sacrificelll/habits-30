import type { Habit } from "./types";
import { dateKey } from "./date";

/**
 * Общий «стрик»: сколько дней подряд (заканчивая сегодня или вчера) была
 * отмечена хотя бы одна привычка. Не привязан к конкретной привычке.
 *
 * Грейс-период в один день: если сегодня ещё не отмечено, но вчера было —
 * стрик жив (у пользователя есть весь день, чтобы продолжить). Если пропущены
 * и сегодня, и вчера — стрик равен 0.
 */
export function computeCurrentStreak(habits: Habit[], today: string): number {
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
