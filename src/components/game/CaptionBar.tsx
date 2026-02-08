"use client";

interface CaptionBarProps {
  caption: string;
  isWarning?: boolean;
}

export function CaptionBar({ caption, isWarning = false }: CaptionBarProps) {
  return (
    <div
      className={`px-4 py-3 font-bold text-sm tracking-wider uppercase font-mono min-h-[52px] flex items-center ${
        isWarning ? "text-red-500" : "text-white"
      }`}
    >
      {caption}
    </div>
  );
}
