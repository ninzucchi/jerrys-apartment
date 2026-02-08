"use client";

import { Guest } from "@/lib/types";
import { GUEST_DEFINITIONS } from "@/lib/constants";

interface GuestSpriteProps {
  guest: Guest;
  isSelected: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}

/**
 * Placeholder guest sprite – renders a colored rectangle with
 * the guest's initial(s) and any status indicators.
 * Will be replaced with actual pixel art sprites later.
 */
export function GuestSprite({
  guest,
  isSelected,
  onClick,
  size = "md",
}: GuestSpriteProps) {
  const def = GUEST_DEFINITIONS[guest.type];
  const dims = size === "sm" ? "w-8 h-10" : "w-10 h-14";
  const fontSize = size === "sm" ? "text-[8px]" : "text-[10px]";

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-end ${dims} cursor-pointer group`}
      title={guest.name}
    >
      {/* Trouble indicator */}
      {guest.troubleActive && !guest.troubleCancelled && (
        <span className="absolute -top-1 -right-1 text-red-500 font-bold text-xs leading-none">
          X
        </span>
      )}
      {/* Star indicator */}
      {guest.isStar && (
        <span className="absolute -top-1 -left-0.5 text-yellow-400 text-xs leading-none">
          ★
        </span>
      )}
      {/* Sprite body */}
      <div
        className={`w-full flex-1 rounded-t-sm border-2 ${
          isSelected
            ? "border-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]"
            : "border-transparent group-hover:border-white/40"
        }`}
        style={{ backgroundColor: def.color }}
      />
      {/* Pop number */}
      {guest.popularity !== 0 && (
        <span
          className={`absolute bottom-0 left-0.5 ${fontSize} font-bold leading-none ${
            guest.popularity > 0 ? "text-yellow-300" : "text-red-400"
          }`}
        >
          {guest.popularity}
        </span>
      )}
      {/* Cash number */}
      {guest.cash !== 0 && (
        <span
          className={`absolute bottom-0 right-0.5 ${fontSize} font-bold leading-none ${
            guest.cash > 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {guest.cash}
        </span>
      )}
    </button>
  );
}
