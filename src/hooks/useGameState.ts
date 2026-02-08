"use client";

import { useReducer, useCallback } from "react";
import { GameAction, SelectableItem } from "@/lib/types";
import { gameReducer, createInitialState } from "@/lib/game-engine";

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, 0, createInitialState);

  const openDoor = useCallback(() => {
    dispatch({ type: "OPEN_DOOR" });
  }, []);

  const endParty = useCallback(() => {
    dispatch({ type: "END_PARTY" });
  }, []);

  const selectItem = useCallback((item: SelectableItem) => {
    dispatch({ type: "SELECT_ITEM", item });
  }, []);

  const banGuest = useCallback((guestId: string) => {
    dispatch({ type: "BAN_GUEST", guestId });
  }, []);

  const dismiss = useCallback(() => {
    dispatch({ type: "DISMISS" });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const toggleRolodex = useCallback(() => {
    dispatch({ type: "TOGGLE_ROLODEX" });
  }, []);

  const dispatchAction = useCallback(
    (action: GameAction) => dispatch(action),
    []
  );

  return {
    state,
    openDoor,
    endParty,
    selectItem,
    banGuest,
    dismiss,
    startGame,
    toggleRolodex,
    dispatch: dispatchAction,
  };
}
