export interface Habit {
  id: string;
  name: string;
  /** Цель в днях: от 7 до 30 (требование ТЗ). */
  goalDays: number;
  /** HEX-цвет привычки. */
  color: string;
  /** Когда создана (ISO). */
  createdAt: string;
  /** Даты выполнения в формате YYYY-MM-DD. */
  completedDates: string[];
}

/** «Живой» стрик: продлевается только сегодняшней отметкой, не зависит от правок прошлых дней. */
export interface StreakState {
  /** Текущая серия дней подряд. */
  current: number;
  /** Лучшая серия за всё время (рекорд, не уменьшается). */
  best: number;
  /** Дата последней сегодняшней отметки, продлившей серию (YYYY-MM-DD), или null. */
  lastDay: string | null;
}

export interface AppState {
  habits: Habit[];
  streak: StreakState;
}
