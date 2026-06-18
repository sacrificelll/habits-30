import type { AppState } from "./types";

const STORAGE_KEY = "habits-30:v1";
const EMPTY_STATE: AppState = { habits: [] };

/** Читает состояние из localStorage. На сервере и при ошибке возвращает пустое. */
export function loadState(): AppState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || !Array.isArray(parsed.habits)) return EMPTY_STATE;
    return { habits: parsed.habits };
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

/** Полностью удаляет данные приложения (для будущей кнопки «Сбросить»). */
export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
