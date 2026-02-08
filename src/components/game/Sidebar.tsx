"use client";

import { GameState } from "@/lib/types";
import { StatsPanel } from "./StatsPanel";
import { InfoPanel } from "./InfoPanel";

interface SidebarProps {
  state: GameState;
  onOpenDoor: () => void;
  onEndParty: () => void;
}

export function Sidebar({ state, onOpenDoor, onEndParty }: SidebarProps) {
  const canOpenDoor =
    state.phase === "party" &&
    state.guestsInHouse.length < state.houseSize &&
    state.drawPile.length > 0;

  const canEndParty =
    state.phase === "party" && state.guestsInHouse.length > 0;

  return (
    <div className="flex flex-col gap-3 h-full">
      <StatsPanel
        popularity={state.popularity}
        maxPopularity={state.maxPopularity}
        cash={state.cash}
        maxCash={state.maxCash}
        turnsRemaining={state.turnsRemaining}
        starsInHouse={state.starsInHouse}
        starsRequired={state.starsRequired}
      />
      <InfoPanel
        selectedItem={state.selectedItem}
        onOpenDoor={onOpenDoor}
        onEndParty={onEndParty}
        canOpenDoor={canOpenDoor}
        canEndParty={canEndParty}
        phase={state.phase}
      />
    </div>
  );
}
