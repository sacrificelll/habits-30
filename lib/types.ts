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

export interface AppState {
  habits: Habit[];
}
