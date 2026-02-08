"use client";

interface StatsPanelProps {
  popularity: number;
  maxPopularity: number;
  cash: number;
  maxCash: number;
  turnsRemaining: number;
  starsInHouse: number;
  starsRequired: number;
}

function StatRow({
  icon,
  label,
  value,
  max,
  iconBg,
  textColor,
}: {
  icon: string;
  label: string;
  value: number;
  max?: number;
  iconBg: string;
  textColor: string;
}) {
  return (
    <div className="flex items-stretch border-2 border-indigo-800">
      <div
        className={`${iconBg} flex items-center justify-center w-14 h-14 border-r-2 border-indigo-800`}
      >
        <span className="text-xl font-bold">{icon}</span>
      </div>
      <div
        className={`flex-1 flex items-center justify-center ${textColor} font-bold text-2xl font-mono tabular-nums bg-zinc-900 px-3`}
      >
        {max !== undefined ? `${value} / ${max}` : value}
      </div>
    </div>
  );
}

export function StatsPanel({
  popularity,
  maxPopularity,
  cash,
  maxCash,
  turnsRemaining,
  starsInHouse,
  starsRequired,
}: StatsPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <StatRow
        icon="Pop"
        label="Popularity"
        value={popularity}
        max={maxPopularity}
        iconBg="bg-yellow-500"
        textColor="text-yellow-400"
      />
      <StatRow
        icon="$"
        label="Cash"
        value={cash}
        max={maxCash}
        iconBg="bg-green-600"
        textColor="text-green-400"
      />
      <StatRow
        icon="⏳"
        label="Time"
        value={turnsRemaining}
        iconBg="bg-cyan-500"
        textColor="text-cyan-300"
      />
      {/* Star indicators */}
      <div className="flex justify-center gap-1 mt-1">
        {Array.from({ length: starsRequired }).map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < starsInHouse ? "text-yellow-400" : "text-indigo-700"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
