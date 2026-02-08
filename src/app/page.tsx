"use client";

import { useMemo } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { GameLayout } from "@/components/game/GameLayout";
import { Guest } from "@/lib/types";

export default function Home() {
  const { state, openDoor, endParty, selectItem, banGuest, dismiss } =
    useGameState();

  const handleSelectGuest = (guest: Guest) => {
    selectItem({ kind: "guest", guest });
  };

  const handleSelectDoor = () => {
    selectItem({ kind: "front_door" });
  };

  // Memoize the actions object so the keyboard hook doesn't
  // re-register on every render
  const keyboardActions = useMemo(
    () => ({ openDoor, endParty, selectItem, dismiss, banGuest }),
    [openDoor, endParty, selectItem, dismiss, banGuest]
  );

  useKeyboardNavigation(state, keyboardActions);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0D0D2B]">
      <h1 className="text-white text-xs mb-4 tracking-widest uppercase opacity-60">
        Party House
      </h1>
      <GameLayout
        state={state}
        onOpenDoor={openDoor}
        onEndParty={endParty}
        onSelectGuest={handleSelectGuest}
        onSelectDoor={handleSelectDoor}
        onDismiss={dismiss}
      />
      <p className="text-gray-600 text-[10px] mt-4 tracking-wider">
        BASED ON PARTY HOUSE FROM UFO 50 &middot; ARROW KEYS + X/Z TO PLAY
      </p>
    </div>
  );
}
