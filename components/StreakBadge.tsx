interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const active = streak > 0;

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-eerie-light bg-eerie px-3.5 py-2">
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
      <div className="text-right leading-none">
        <div className={`text-lg font-bold ${active ? "text-cream" : "text-fog"}`}>
          {streak}
        </div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wide text-fog">
          стрик
        </div>
      </div>
    </div>
  );
}
