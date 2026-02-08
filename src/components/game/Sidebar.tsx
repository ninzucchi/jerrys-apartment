"use client";

import { useMemo } from "react";
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

  // Compute live stats from guests currently in the house
  const livePartyPop = useMemo(
    () => state.guestsInHouse.reduce((sum, g) => sum + g.popularity, 0),
    [state.guestsInHouse]
  );

  const livePartyCash = useMemo(
    () => state.guestsInHouse.reduce((sum, g) => sum + g.cash, 0),
    [state.guestsInHouse]
  );

  const liveStars = useMemo(
    () => state.guestsInHouse.filter((g) => g.isStar).length,
    [state.guestsInHouse]
  );

  return (
    <div className="flex flex-col gap-3 h-full">
      <StatsPanel
        popularity={livePartyPop}
        maxPopularity={state.maxPopularity}
        cash={livePartyCash}
        maxCash={state.maxCash}
        turnsRemaining={state.turnsRemaining}
        starsInHouse={liveStars}
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
