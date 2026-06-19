"use client";

import { useState } from "react";

interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="rounded-2xl border border-hot-orange/40 bg-eerie p-4 text-center">
        <p className="text-sm text-cream">
          Сбросить все привычки и отметки? Вернуть данные будет нельзя.
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              onReset();
              setConfirming(false);
            }}
            className="rounded-xl bg-hot-orange px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-orange-wheel"
          >
            Да, сбросить
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-xl border border-eerie-light px-4 py-2 text-sm text-fog transition-colors hover:text-cream"
          >
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="w-full rounded-2xl border border-eerie-light px-4 py-3 text-sm font-medium text-fog transition-colors hover:border-hot-orange hover:text-hot-orange"
    >
      Сбросить все данные
    </button>
  );
}
