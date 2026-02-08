"use client";

import { useEffect, useCallback } from "react";
import { GameState, SelectableItem } from "@/lib/types";

interface KeyboardNavigationActions {
  openDoor: () => void;
  endParty: () => void;
  selectItem: (item: SelectableItem) => void;
  dismiss: () => void;
  banGuest: (guestId: string) => void;
  toggleRolodex: () => void;
}

/**
 * Build the ordered list of selectable items for the party scene.
 * [rolodex, front_door, guest_0, guest_1, ...]
 */
function getSelectableItems(state: GameState): SelectableItem[] {
  const items: SelectableItem[] = [
    { kind: "rolodex" },
    { kind: "front_door" },
  ];
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
  if (selected.kind === "rolodex") return 0;
  if (selected.kind === "front_door") return 1;
  if (selected.kind === "guest") {
    const idx = items.findIndex(
      (item) => item.kind === "guest" && item.guest.id === selected.guest.id
    );
    return idx >= 0 ? idx : 1; // Fall back to front door
  }
  return 1;
}

/** Column count for the rolodex grid navigation. */
const ROLODEX_COLS = 5;

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
          if (state.selectedItem.kind === "guest") {
            actions.banGuest(state.selectedItem.guest.id);
          }
        }
        return;
      }

      // --- Party phase ---
      if (state.phase === "party") {
        // ---- Rolodex open: grid navigation ----
        // The grid has a "close" button at index 0, then guests at 1..N.
        if (state.rolodexOpen) {
          const guests = state.rolodex;
          // Total items: 1 (close btn) + guests.length
          const totalItems = 1 + guests.length;

          // Map current selection to a flat index (0 = close, 1+ = guests)
          const sel = state.selectedItem;
          let currentIdx: number;
          if (sel.kind === "rolodex") {
            currentIdx = 0;
          } else if (sel.kind === "guest") {
            const gi = guests.findIndex((g) => g.id === sel.guest.id);
            currentIdx = gi >= 0 ? gi + 1 : 0;
          } else {
            currentIdx = 0;
          }

          /** Convert flat index back to a SelectableItem. */
          const itemAt = (idx: number): SelectableItem =>
            idx === 0
              ? { kind: "rolodex" }
              : { kind: "guest", guest: guests[idx - 1] };

          switch (e.code) {
            case "ArrowRight": {
              const next = Math.min(currentIdx + 1, totalItems - 1);
              actions.selectItem(itemAt(next));
              break;
            }
            case "ArrowLeft": {
              const next = Math.max(currentIdx - 1, 0);
              actions.selectItem(itemAt(next));
              break;
            }
            case "ArrowDown": {
              const next = Math.min(
                currentIdx + ROLODEX_COLS,
                totalItems - 1
              );
              actions.selectItem(itemAt(next));
              break;
            }
            case "ArrowUp": {
              const next = Math.max(currentIdx - ROLODEX_COLS, 0);
              actions.selectItem(itemAt(next));
              break;
            }
            case "KeyX": {
              // If on the close button, close the rolodex
              if (currentIdx === 0) {
                actions.toggleRolodex();
              }
              break;
            }
            case "KeyZ": {
              // Z always closes the rolodex as a shortcut
              actions.toggleRolodex();
              break;
            }
          }
          return;
        }

        // ---- Normal party scene navigation ----
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
            const ROW_SIZE = 10;
            const nextIdx = Math.min(
              currentIdx + ROW_SIZE,
              items.length - 1
            );
            actions.selectItem(items[nextIdx]);
            break;
          }
          case "ArrowUp": {
            const ROW_SIZE = 10;
            const nextIdx = Math.max(currentIdx - ROW_SIZE, 0);
            actions.selectItem(items[nextIdx]);
            break;
          }
          case "KeyX": {
            if (state.selectedItem.kind === "front_door") {
              actions.openDoor();
            } else if (state.selectedItem.kind === "rolodex") {
              actions.toggleRolodex();
            }
            // TODO: when guest is selected, X could use their ability
            break;
          }
          case "KeyZ": {
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
