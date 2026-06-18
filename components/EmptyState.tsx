export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-eerie-light bg-night/40 px-6 py-12 text-center">
      <p className="text-lg font-semibold text-cream">Пока ни одной привычки</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-fog">
        Выбери подсказку выше или впиши свою — и она появится здесь. Можно
        добавить до 5 привычек.
      </p>
    </div>
  );
}
