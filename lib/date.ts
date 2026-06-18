/**
 * Локальная дата устройства в формате YYYY-MM-DD.
 * «День» определяется по часовому поясу пользователя, а не по UTC.
 */
export function dateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Строит последовательность из `length` дат (ключей YYYY-MM-DD),
 * начиная с `startKey` включительно. Переход через границы месяцев
 * обрабатывается автоматически конструктором Date.
 */
export function buildDayRange(startKey: string, length: number): string[] {
  const [year, month, day] = startKey.split("-").map(Number);
  const keys: string[] = [];
  for (let i = 0; i < length; i++) {
    keys.push(dateKey(new Date(year, month - 1, day + i)));
  }
  return keys;
}
