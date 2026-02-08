"use client";

import { SelectableItem, Guest } from "@/lib/types";
import { GUEST_DEFINITIONS } from "@/lib/constants";

interface InfoPanelProps {
  selectedItem: SelectableItem;
  onOpenDoor: () => void;
  onEndParty: () => void;
  canOpenDoor: boolean;
  canEndParty: boolean;
  phase: string;
}

function GuestInfo({ guest }: { guest: Guest }) {
  const def = GUEST_DEFINITIONS[guest.type];
  return (
    <div className="flex flex-col gap-2">
      <h3
        className="text-lg font-bold uppercase tracking-wide text-center"
        style={{ color: def.color }}
      >
        {guest.name}
      </h3>
      <div className="border-2 border-white bg-black p-3 space-y-1">
        {guest.troubleActive && !guest.troubleCancelled && (
          <div className="text-red-500 font-bold text-sm">
            TROUBLE!
          </div>
        )}
        {guest.troubleActive && guest.troubleCancelled && (
          <div className="text-gray-500 font-bold text-sm line-through">
            TROUBLE!
          </div>
        )}
        {guest.popularity !== 0 && (
          <div
            className={`text-sm font-bold ${
              guest.popularity > 0 ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {guest.popularity > 0 ? "+" : ""}
            {guest.popularity} POP
          </div>
        )}
        {guest.cash !== 0 && (
          <div
            className={`text-sm font-bold ${
              guest.cash > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {guest.cash > 0 ? "+" : ""}
            {guest.cash} CASH
          </div>
        )}
        {guest.ability &&
          guest.ability !== "trouble" &&
          guest.ability !== "cancel_trouble" && (
            <div className="text-xs text-gray-300 mt-1 uppercase">
              {getAbilityDescription(guest.ability)}
            </div>
          )}
        {guest.ability === "cancel_trouble" && (
          <div className="text-xs text-green-300 mt-1">
            CANCELS TROUBLE
          </div>
        )}
        {guest.isStar && (
          <div className="text-yellow-300 text-xs font-bold mt-1">
            ★ STAR GUEST
          </div>
        )}
      </div>
    </div>
  );
}

function FrontDoorInfo({
  onOpenDoor,
  onEndParty,
  canOpenDoor,
  canEndParty,
}: {
  onOpenDoor: () => void;
  onEndParty: () => void;
  canOpenDoor: boolean;
  canEndParty: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-bold uppercase tracking-wide text-center text-white">
        FRONT DOOR
      </h3>
      <div className="border-2 border-white bg-black p-3 space-y-2">
        <button
          onClick={onOpenDoor}
          disabled={!canOpenDoor}
          className={`w-full text-left font-bold text-sm py-1 ${
            canOpenDoor
              ? "text-white hover:text-yellow-300 cursor-pointer"
              : "text-gray-600 cursor-not-allowed"
          }`}
        >
          <span className="inline-block w-6 h-6 bg-yellow-600 text-black text-center text-xs leading-6 mr-2 align-middle">
            X
          </span>
          :OPEN
        </button>
        <button
          onClick={onEndParty}
          disabled={!canEndParty}
          className={`w-full text-left font-bold text-sm py-1 ${
            canEndParty
              ? "text-white hover:text-yellow-300 cursor-pointer"
              : "text-gray-600 cursor-not-allowed"
          }`}
        >
          <span className="inline-block w-6 h-6 bg-blue-600 text-white text-center text-xs leading-6 mr-2 align-middle">
            Z
          </span>
          :END PARTY
        </button>
      </div>
    </div>
  );
}

function getAbilityDescription(ability: string): string {
  const descriptions: Record<string, string> = {
    fetch: "FETCH A SPECIFIC GUEST",
    boot: "BOOT OUT ONE GUEST",
    peek: "PEEK AT NEXT GUEST",
    shuffle: "SEND ALL GUESTS OUT & RESHUFFLE",
    bring_one: "BRINGS +1 RANDOM GUEST",
    bring_two: "BRINGS +2 RANDOM GUESTS",
    photographer: "CAPTURE ONE GUEST'S REWARD",
    comedian: "+5 POP IF HOUSE IS FULL",
    dancer: "POP SCALES WITH # OF DANCERS",
    mascot: "+1 POP PER OLD FRIEND",
    introvert: "+1 POP PER EMPTY SPACE",
    stylist: "PERMANENTLY +1 POP TO A GUEST",
    bartender: "+2 CASH PER TROUBLE",
    writer: "+2 POP PER TROUBLE",
    climber: "+1 POP EACH APPEARANCE",
    cheerleader: "REFRESH ALL ABILITIES",
    greeter: "ADMIT & SCORE NEXT GUEST",
    magician: "SWAP STAR & NON-STAR GUEST",
    cupid: "BOOT TWO ADJACENT GUESTS",
    counselor: "REMOVE ALL TROUBLE",
    werewolf: "TROUBLE EVERY OTHER VISIT",
  };
  return descriptions[ability] || ability.toUpperCase();
}

export function InfoPanel({
  selectedItem,
  onOpenDoor,
  onEndParty,
  canOpenDoor,
  canEndParty,
  phase,
}: InfoPanelProps) {
  // Shutdown phase: show guest info + ban prompt
  if (phase === "shutdown") {
    return (
      <div className="min-h-[160px]">
        {selectedItem.kind === "guest" ? (
          <div className="flex flex-col gap-2">
            <GuestInfo guest={selectedItem.guest} />
            <div className="text-center text-xs text-yellow-300 mt-1 font-bold">
              PRESS X TO BAN
            </div>
          </div>
        ) : (
          <div className="border-2 border-white bg-black p-4 min-h-[160px] text-center text-xs text-gray-400">
            USE ARROWS TO SELECT A GUEST TO BAN
          </div>
        )}
      </div>
    );
  }

  // Non-party phases: empty panel
  if (phase !== "party") {
    return (
      <div className="border-2 border-white bg-black p-4 min-h-[160px]" />
    );
  }

  return (
    <div className="min-h-[160px]">
      {selectedItem.kind === "front_door" && (
        <FrontDoorInfo
          onOpenDoor={onOpenDoor}
          onEndParty={onEndParty}
          canOpenDoor={canOpenDoor}
          canEndParty={canEndParty}
        />
      )}
      {selectedItem.kind === "guest" && (
        <GuestInfo guest={selectedItem.guest} />
      )}
      {selectedItem.kind === "none" && (
        <div className="border-2 border-white bg-black p-4 min-h-[160px]" />
      )}
    </div>
  );
}
