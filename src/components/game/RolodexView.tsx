"use client";

import { Guest, SelectableItem } from "@/lib/types";
import { GuestSprite } from "./GuestSprite";

interface RolodexViewProps {
  guests: Guest[];
  selectedItem: SelectableItem;
  onSelectGuest: (guest: Guest) => void;
  onClose: () => void;
  onSelectClose: () => void;
}

export function RolodexView({
  guests,
  selectedItem,
  onSelectGuest,
  onClose,
  onSelectClose,
}: RolodexViewProps) {
  const isCloseSelected = selectedItem.kind === "rolodex";

  return (
    <div className="relative w-full h-full min-h-[320px] bg-[#2A2A3A] overflow-hidden select-none flex flex-col">
      {/* Header bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-[#4A7AB5]">
        <h2 className="text-white text-sm font-bold tracking-wider">
          CONTACTS
        </h2>
        <span className="text-green-300 text-sm font-bold tabular-nums">
          {guests.length}
        </span>
      </div>

      {/* Grid: close button + guests */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap gap-2">
          {/* Close / back button as the first grid item */}
          <button
            onClick={() => { onSelectClose(); onClose(); }}
            className={`w-10 h-14 flex flex-col items-center justify-center cursor-pointer border-2 ${
              isCloseSelected
                ? "border-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                : "border-white/20 hover:border-white/40"
            } bg-[#1A0A2E]`}
            title="Close Rolodex"
          >
            <span className="text-white text-lg leading-none">&larr;</span>
            <span className="text-[5px] text-gray-300 mt-0.5 leading-none">
              BACK
            </span>
          </button>

          {guests.map((guest) => (
            <GuestSprite
              key={guest.id}
              guest={guest}
              isSelected={
                selectedItem.kind === "guest" &&
                selectedItem.guest.id === guest.id
              }
              onClick={() => onSelectGuest(guest)}
              size="md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
