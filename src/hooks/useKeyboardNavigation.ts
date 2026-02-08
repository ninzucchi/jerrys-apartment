"use client";

import { useEffect, useCallback } from "react";
import { GameState, Guest, SelectableItem } from "@/lib/types";

interface KeyboardNavigationActions {
  openDoor: () => void;
  endParty: () => void;
  selectItem: (item: SelectableItem) => void;
  dismiss: () => void;
  banGuest: (guestId: string) => void;
}

/**
 * Build the ordered list of selectable items for the current state.
 * Index 0 is always the front door, followed by guests in house order.
 */
function getSelectableItems(state: GameState): SelectableItem[] {
  const items: SelectableItem[] = [{ kind: "front_door" }];
  for (const guest of state.guestsInHouse) {
    items.push({ kind: "guest", guest });
  }
  return items;
}

/**
 * Find the current selection's index in the selectable items list.
 */
function getSelectedIndex(
  items: SelectableItem[],
  selected: SelectableItem
): number {
  if (selected.kind === "front_door") return 0;
  if (selected.kind === "guest") {
    const idx = items.findIndex(
      (item) => item.kind === "guest" && item.guest.id === selected.guest.id
    );
    return idx >= 0 ? idx : 0;
  }
  return 0;
}

export function useKeyboardNavigation(
  state: GameState,
  actions: KeyboardNavigationActions
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default browser scrolling for arrow keys and game keys
      const gameKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "KeyX",
        "KeyZ",
        "Enter",
        "Space",
      ];
      if (gameKeys.includes(e.code)) {
        e.preventDefault();
      }

      // --- Dismiss overlays (party_ended, scenario_won, scenario_lost) ---
      const dismissPhases = ["party_ended", "scenario_won", "scenario_lost"];
      if (dismissPhases.includes(state.phase)) {
        if (
          e.code === "KeyX" ||
          e.code === "KeyZ" ||
          e.code === "Enter" ||
          e.code === "Space"
        ) {
          actions.dismiss();
        }
        return;
      }

      // --- Shutdown phase: select a guest to ban ---
      if (state.phase === "shutdown") {
        const guests = state.guestsInHouse;
        if (guests.length === 0) return;

        // Find currently selected guest index
        const sel = state.selectedItem;
        let currentIdx =
          sel.kind === "guest"
            ? guests.findIndex((g) => g.id === sel.guest.id)
            : 0;
        if (currentIdx < 0) currentIdx = 0;

        if (e.code === "ArrowRight" || e.code === "ArrowDown") {
          const nextIdx = (currentIdx + 1) % guests.length;
          actions.selectItem({ kind: "guest", guest: guests[nextIdx] });
        } else if (e.code === "ArrowLeft" || e.code === "ArrowUp") {
          const nextIdx =
            (currentIdx - 1 + guests.length) % guests.length;
          actions.selectItem({ kind: "guest", guest: guests[nextIdx] });
        } else if (e.code === "KeyX" || e.code === "Enter") {
          // Confirm ban on selected guest
          if (state.selectedItem.kind === "guest") {
            actions.banGuest(state.selectedItem.guest.id);
          }
        }
        return;
      }

      // --- Party phase: navigate and act ---
      if (state.phase === "party") {
        const items = getSelectableItems(state);
        const currentIdx = getSelectedIndex(items, state.selectedItem);

        switch (e.code) {
          case "ArrowRight": {
            const nextIdx = Math.min(currentIdx + 1, items.length - 1);
            actions.selectItem(items[nextIdx]);
            break;
          }
          case "ArrowLeft": {
            const nextIdx = Math.max(currentIdx - 1, 0);
            actions.selectItem(items[nextIdx]);
            break;
          }
          case "ArrowDown": {
            // Jump forward by a "row" – estimate ~10 items per row,
            // or just move to last item if near the end
            const ROW_SIZE = 10;
            const nextIdx = Math.min(
              currentIdx + ROW_SIZE,
              items.length - 1
            );
            actions.selectItem(items[nextIdx]);
            break;
          }
          case "ArrowUp": {
            // Jump back by a row
            const ROW_SIZE = 10;
            const nextIdx = Math.max(currentIdx - ROW_SIZE, 0);
            actions.selectItem(items[nextIdx]);
            break;
          }
          case "KeyX": {
            // Primary action based on selection
            if (state.selectedItem.kind === "front_door") {
              actions.openDoor();
            }
            // TODO: when guest is selected, X could use their ability
            break;
          }
          case "KeyZ": {
            // Secondary action
            if (state.selectedItem.kind === "front_door") {
              actions.endParty();
            }
            break;
          }
        }
        return;
      }
    },
    [state, actions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
