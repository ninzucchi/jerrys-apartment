"use client";

import { GameState, Guest } from "@/lib/types";
import { PartyScene } from "./PartyScene";
import { Sidebar } from "./Sidebar";
import { CaptionBar } from "./CaptionBar";

interface GameLayoutProps {
  state: GameState;
  onOpenDoor: () => void;
  onEndParty: () => void;
  onSelectGuest: (guest: Guest) => void;
  onSelectDoor: () => void;
  onDismiss: () => void;
}

export function GameLayout({
  state,
  onOpenDoor,
  onEndParty,
  onSelectGuest,
  onSelectDoor,
  onDismiss,
}: GameLayoutProps) {
  const isWarningCaption =
    state.phase === "shutdown" ||
    state.caption.includes("GETTING OUT OF HAND") ||
    state.caption.includes("OH NO");

  const showDismissOverlay =
    state.phase === "party_ended" ||
    state.phase === "scenario_won" ||
    state.phase === "scenario_lost";

  return (
    <div className="relative w-full max-w-[960px] mx-auto aspect-[16/9] bg-black border-2 border-indigo-900 overflow-hidden">
      {/* Main grid: scene (left) + sidebar (right) */}
      <div className="grid grid-cols-[1fr_220px] h-full">
        {/* Left column: scene + caption */}
        <div className="flex flex-col">
          {/* Party scene takes most of the space */}
          <div className="flex-1 relative">
            <PartyScene
              guestsInHouse={state.guestsInHouse}
              houseSize={state.houseSize}
              selectedItem={state.selectedItem}
              onSelectGuest={onSelectGuest}
              onSelectDoor={onSelectDoor}
              phase={state.phase}
            />
          </div>
          {/* Caption bar at bottom */}
          <CaptionBar caption={state.caption} isWarning={isWarningCaption} />
        </div>

        {/* Right column: sidebar */}
        <div className="bg-[#0D0D2B] p-2 border-l-2 border-indigo-900">
          <Sidebar
            state={state}
            onOpenDoor={onOpenDoor}
            onEndParty={onEndParty}
          />
        </div>
      </div>

      {/* Dismiss overlay for results screens */}
      {showDismissOverlay && (
        <button
          onClick={onDismiss}
          className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
        >
          <div className="bg-black border-2 border-white px-8 py-4 text-white font-bold text-sm uppercase tracking-wider">
            {state.phase === "scenario_won"
              ? "🎉 SCENARIO COMPLETE! CLICK TO CONTINUE"
              : state.phase === "scenario_lost"
              ? "💀 GAME OVER. CLICK TO RESTART"
              : "CLICK TO CONTINUE"}
          </div>
        </button>
      )}
    </div>
  );
}
