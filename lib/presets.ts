/**
 * Подсказки-пресеты для быстрого старта. По клику подставляются в поле ввода —
 * НЕ создаются автоматически. Пользователь всегда может вписать свою привычку.
 */
export const HABIT_PRESETS = [
  { icon: "🏋️", label: "Ходить в зал" },
  { icon: "📖", label: "Читать книгу" },
  { icon: "🚭", label: "Без курения" },
];

/** Палитра цветов привычки. Подобрана так, чтобы читалась на тёмном фоне. */
export const HABIT_COLORS = [
  "#EB4604", // hot orange
  "#F77E0D", // orange wheel
  "#99A57D", // moss
  "#5AA9C9", // sky
  "#9B7EDE", // violet
  "#E06A8B", // rose
];

export const MAX_HABITS = 5;
export const MIN_GOAL = 7;
// Диапазон цели по ТЗ: 7–30 дней (приложение «Habits 30», сетка тоже 30 дней).
export const MAX_GOAL = 30;
export const DEFAULT_GOAL = 30;
