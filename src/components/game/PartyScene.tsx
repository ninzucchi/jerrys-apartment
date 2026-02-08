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

      {/* Interior floor – unified grid of all interactable items */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[#1A0A2E]">
        {/* Floor line */}
        <div className="absolute inset-x-4 top-0 h-[2px] bg-[#3D2060]" />

        <div className="flex flex-wrap items-end gap-1 p-2">
          {/* Rolodex cell */}
          <button
            onClick={onSelectRolodex}
            className={`w-10 h-14 flex flex-col items-center justify-center cursor-pointer border-2 rounded-t-sm ${
              selectedItem.kind === "rolodex"
                ? "border-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                : "border-transparent hover:border-white/40"
            }`}
            style={{ backgroundColor: "#5C2D0E" }}
            title="Rolodex"
          >
            <span className="text-[7px] text-amber-200 font-bold leading-tight text-center">
              ROL
            </span>
          </button>

          {/* Front door cell */}
          <button
            onClick={onSelectDoor}
            className={`w-10 h-14 flex flex-col items-center justify-center cursor-pointer border-2 rounded-t-sm ${
              selectedItem.kind === "front_door"
                ? "border-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                : "border-transparent hover:border-white/40"
            }`}
            style={{ backgroundColor: "#2D5A27" }}
            title="Front Door"
          >
            <span className="text-[7px] text-green-200 font-bold leading-tight text-center">
              DOOR
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1" />
          </button>

          {/* Guest cells */}
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
    </div>
  );
}
