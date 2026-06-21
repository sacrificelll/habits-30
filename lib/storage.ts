import type { AppState, Habit, StreakState } from "./types";
import { deriveStreakFromHistory } from "./streak";
import { dateKey } from "./date";
import { MIN_GOAL, MAX_GOAL, DEFAULT_GOAL, HABIT_COLORS } from "./presets";

const STORAGE_KEY = "habits-30:v1";
const EMPTY_STATE: AppState = {
  habits: [],
  streak: { current: 0, best: 0, lastDay: null },
};

const isString = (value: unknown): value is string => typeof value === "string";

/**
 * Приводит сырую запись из localStorage к корректной привычке.
 * Возвращает null, если запись повреждена — такие отбраковываются, чтобы
 * битые данные (ручная правка, старый формат) не роняли приложение.
 */
function sanitizeHabit(raw: unknown): Habit | null {
  if (!raw || typeof raw !== "object") return null;
  const habit = raw as Record<string, unknown>;
  if (!isString(habit.id) || !isString(habit.name) || !isString(habit.createdAt)) {
    return null;
  }
  if (!Array.isArray(habit.completedDates)) return null;

  const goalDays =
    typeof habit.goalDays === "number" && Number.isFinite(habit.goalDays)
      ? Math.min(MAX_GOAL, Math.max(MIN_GOAL, Math.round(habit.goalDays)))
      : DEFAULT_GOAL;

  return {
    id: habit.id,
    name: habit.name,
    goalDays,
    color: isString(habit.color) ? habit.color : HABIT_COLORS[0],
    createdAt: habit.createdAt,
    completedDates: habit.completedDates.filter(isString),
  };
}

/** Проверяет сохранённый стрик; при некорректной форме возвращает null. */
function sanitizeStreak(raw: unknown): StreakState | null {
  if (!raw || typeof raw !== "object") return null;
  const streak = raw as Record<string, unknown>;
  if (typeof streak.current !== "number" || !Number.isFinite(streak.current)) {
    return null;
  }
  if (typeof streak.best !== "number" || !Number.isFinite(streak.best)) {
    return null;
  }
  if (streak.lastDay !== null && !isString(streak.lastDay)) return null;
  return {
    current: streak.current,
    best: streak.best,
    lastDay: streak.lastDay as string | null,
  };
}

/** Читает состояние из localStorage. На сервере и при ошибке возвращает пустое. */
export function loadState(): AppState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || !Array.isArray(parsed.habits)) return EMPTY_STATE;

    // Отбраковываем повреждённые записи, чтобы битые данные не роняли страницу.
    const habits = parsed.habits
      .map(sanitizeHabit)
      .filter((habit): habit is Habit => habit !== null);

    // Старые данные без стрика (или повреждённый стрик) — восстанавливаем из истории.
    const streak =
      sanitizeStreak(parsed.streak) ?? deriveStreakFromHistory(habits, dateKey());

    return { habits, streak };
  } catch {
    return EMPTY_STATE;
  }
}

/** Сохраняет состояние. Тихо игнорирует ошибки (например, приватный режим). */
export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* localStorage недоступен — ничего не делаем */
  }
}

/** Полностью удаляет данные приложения (кнопка «Сбросить все данные»). */
export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
