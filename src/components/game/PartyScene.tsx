"use client";

import { Guest, SelectableItem } from "@/lib/types";
import { GuestSprite } from "./GuestSprite";

interface PartySceneProps {
  guestsInHouse: Guest[];
  houseSize: number;
  selectedItem: SelectableItem;
  onSelectGuest: (guest: Guest) => void;
  onSelectDoor: () => void;
  onSelectRolodex: () => void;
  phase: string;
}

export function PartyScene({
  guestsInHouse,
  houseSize,
  selectedItem,
  onSelectGuest,
  onSelectDoor,
  onSelectRolodex,
  phase,
}: PartySceneProps) {
  const isParty = phase === "party";

  return (
    <div className="relative w-full h-full min-h-[320px] bg-[#0D0D2B] overflow-hidden select-none">
      {/* Sky */}
      <div className="absolute inset-x-0 top-0 h-8 bg-[#0D0D2B]" />

      {/* Cat on roof (trouble warning) */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-gray-500">
        🐱
      </div>

      {/* House exterior */}
      <div className="absolute inset-x-4 top-6 bottom-[45%]">
        {/* Roof */}
        <div
          className="absolute inset-x-0 top-0 h-10"
          style={{
            background:
              "linear-gradient(to bottom, #8B1A1A 0%, #A52A2A 100%)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        />
        {/* Wall */}
        <div className="absolute inset-x-0 top-10 bottom-0 bg-[#E0D5C0] border-2 border-[#8B7D6B]">
          {/* Window */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-8 bg-cyan-200 border-2 border-[#4A90A4]" />
        </div>
      </div>

      {/* Interior floor (where guests stand) */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[#1A0A2E]">
        {/* Floor line */}
        <div className="absolute inset-x-4 top-0 h-[2px] bg-[#3D2060]" />

        {/* Rolodex (to the left of the door) */}
        <button
          onClick={onSelectRolodex}
          className={`absolute left-2 top-2 w-7 h-5 cursor-pointer flex items-center justify-center ${
            selectedItem.kind === "rolodex"
              ? "ring-2 ring-yellow-400"
              : "hover:ring-2 hover:ring-white/40"
          }`}
          style={{ backgroundColor: "#5C2D0E" }}
          title="Rolodex"
        >
          <span className="text-[6px] text-amber-200 font-bold leading-none">
            ROL
          </span>
        </button>

        {/* Front door */}
        <button
          onClick={onSelectDoor}
          className={`absolute left-12 top-0 -translate-y-1/2 w-8 h-14 cursor-pointer ${
            selectedItem.kind === "front_door"
              ? "ring-2 ring-yellow-400"
              : "hover:ring-2 hover:ring-white/40"
          }`}
          style={{ backgroundColor: "#2D5A27" }}
          title="Front Door"
        >
          <div className="absolute top-1/2 right-1 w-1.5 h-1.5 rounded-full bg-yellow-600" />
        </button>

        {/* Guest slots */}
        <div className="flex flex-wrap items-end gap-1 px-16 pt-3 pb-2">
          {guestsInHouse.map((guest) => (
            <GuestSprite
              key={guest.id}
              guest={guest}
              isSelected={
                selectedItem.kind === "guest" &&
                selectedItem.guest.id === guest.id
              }
              onClick={() => onSelectGuest(guest)}
            />
          ))}
          {/* Empty slots */}
          {isParty &&
            Array.from({
              length: Math.max(0, houseSize - guestsInHouse.length),
            }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-10 h-14 border border-dashed border-white/10 rounded-sm"
              />
            ))}
        </div>
      </div>

      {/* Furniture decorations */}
      <div className="absolute left-2 bottom-[50%] w-8 h-6 bg-[#5C2D0E] border border-[#3D1F08]" />
      <div className="absolute right-8 bottom-[48%] w-14 h-6 bg-[#8B2323] rounded-sm border border-[#5C1616]" />
    </div>
  );
}
