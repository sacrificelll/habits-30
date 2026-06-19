interface StreakBadgeProps {
  streak: number;
  best: number;
}

export function StreakBadge({ streak, best }: StreakBadgeProps) {
  const active = streak > 0;

  return (
    <div className="shrink-0 rounded-2xl border border-eerie-light bg-eerie px-4 py-2">
      <div className="mb-1.5 text-center text-[10px] uppercase tracking-wider text-fog">
        Серия дней
      </div>

      <div className="flex items-center gap-3.5">
        <div
          className="flex items-center gap-2"
          title="Текущая серия — дней подряд хотя бы с одной отметкой"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`h-5 w-5 ${active ? "text-hot-orange" : "text-fog"}`}
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <div className="leading-none">
            <div
              className={`text-lg font-bold ${active ? "text-cream" : "text-fog"}`}
            >
              {streak}
            </div>
            <div className="mt-1 text-[11px] text-fog">сейчас</div>
          </div>
        </div>

        <div className="h-8 w-px bg-eerie-light" aria-hidden="true" />

        <div
          className="flex items-center gap-2"
          title="Рекорд — лучшая серия за всё время"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-5 w-5 text-orange-wheel"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <div className="leading-none">
            <div className="text-lg font-bold text-cream">{best}</div>
            <div className="mt-1 text-[11px] text-fog">рекорд</div>
          </div>
        </div>
      </div>
    </div>
  );
}
