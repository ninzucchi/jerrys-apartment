import {
  GameState,
  GameAction,
  GamePhase,
  Guest,
  GuestType,
} from "./types";
import {
  GUEST_DEFINITIONS,
  DEFAULT_ROLODEX,
  SCENARIOS,
  INITIAL_HOUSE_SIZE,
  MAX_PARTIES_PER_SCENARIO,
  STARS_REQUIRED,
  TROUBLE_LIMIT,
  INITIAL_EXPANSION_COST,
  INITIAL_POPULARITY_CAP,
  INITIAL_CASH_CAP,
} from "./constants";

// ============================================================
// Helpers
// ============================================================

let nextId = 0;
export function createGuestInstance(type: GuestType): Guest {
  const def = GUEST_DEFINITIONS[type];
  return {
    id: `guest_${nextId++}`,
    type: def.type,
    name: def.name,
    popularity: def.basePopularity,
    cash: def.baseCash,
    ability: def.ability,
    isStar: def.isStar,
    abilityUsed: false,
    troubleActive: def.ability === "trouble",
    troubleCancelled: false,
    climberLevel: type === "climber" ? 1 : undefined,
    werewolfAppearances: type === "werewolf" ? 0 : undefined,
    banned: false,
  };
}

function buildInitialRolodex(): Guest[] {
  const guests: Guest[] = [];
  for (const entry of DEFAULT_ROLODEX) {
    for (let i = 0; i < entry.quantity; i++) {
      guests.push(createGuestInstance(entry.type));
    }
  }
  return guests;
}

/** Fisher-Yates shuffle (returns new array). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function countTrouble(guests: Guest[]): number {
  return guests.filter((g) => g.troubleActive && !g.troubleCancelled).length;
}

function countStars(guests: Guest[]): number {
  return guests.filter((g) => g.isStar).length;
}

// ============================================================
// Initial state
// ============================================================

export function createInitialState(scenarioIndex: number = 0): GameState {
  const scenario = SCENARIOS[scenarioIndex];
  const rolodex = buildInitialRolodex();

  return {
    phase: "party",
    scenarioIndex,
    partyNumber: 1,
    maxParties: MAX_PARTIES_PER_SCENARIO,

    popularity: 0,
    cash: 0,
    maxPopularity: INITIAL_POPULARITY_CAP,
    maxCash: INITIAL_CASH_CAP,

    houseSize: INITIAL_HOUSE_SIZE,
    nextExpansionCost: INITIAL_EXPANSION_COST,
    guestsInHouse: [],

    rolodex,
    drawPile: shuffle(rolodex.filter((g) => !g.banned)),

    starsRequired: STARS_REQUIRED,
    scenarioStarTypes: scenario.starTypes,

    activeTroubleCount: 0,
    troubleLimit: TROUBLE_LIMIT,

    currentAction: "idle",
    peekedGuest: null,

    selectedItem: { kind: "front_door" },
    caption: "GET THIS PARTY STARTED!",
    starsInHouse: 0,

    turnsRemaining: MAX_PARTIES_PER_SCENARIO,
  };
}

// ============================================================
// Reducer (placeholder – game logic will be fleshed out later)
// ============================================================

export function gameReducer(
  state: GameState,
  action: GameAction
): GameState {
  switch (action.type) {
    case "START_GAME":
      return createInitialState(0);

    case "OPEN_DOOR": {
      if (state.phase !== "party") return state;
      if (state.guestsInHouse.length >= state.houseSize) {
        return { ...state, caption: "THE PARTY IS FULL." };
      }
      if (state.drawPile.length === 0) {
        return { ...state, caption: "NO MORE GUESTS AVAILABLE." };
      }

      const [nextGuest, ...remainingPile] = state.drawPile;
      const newGuests = [...state.guestsInHouse, nextGuest];
      const trouble = countTrouble(newGuests);
      const stars = countStars(newGuests);

      // Check for police shutdown
      if (trouble >= state.troubleLimit) {
        return {
          ...state,
          guestsInHouse: newGuests,
          drawPile: remainingPile,
          activeTroubleCount: trouble,
          starsInHouse: stars,
          phase: "shutdown",
          caption: "OH NO! THE COPS HAVE SHOWN UP! WHO GETS THE BLAME?",
          // Auto-select first guest for keyboard ban navigation
          selectedItem: { kind: "guest", guest: newGuests[0] },
        };
      }

      // Check if party is full after this guest
      const isFull = newGuests.length >= state.houseSize;
      const hasAbilities = newGuests.some(
        (g) => !g.abilityUsed && g.ability && g.ability !== "trouble"
      );

      return {
        ...state,
        guestsInHouse: newGuests,
        drawPile: remainingPile,
        activeTroubleCount: trouble,
        starsInHouse: stars,
        caption: isFull
          ? hasAbilities
            ? "PARTY FULL, BUT ACTIONS STILL AVAILABLE."
            : "THE PARTY IS FULL."
          : `${nextGuest.name.toUpperCase()} HAS ARRIVED!`,
      };
    }

    case "END_PARTY": {
      if (state.phase !== "party") return state;

      // Check win condition: 4 stars present
      if (state.starsInHouse >= state.starsRequired) {
        return {
          ...state,
          phase: "scenario_won",
          caption: "YOU WIN! THE PARTY WAS LEGENDARY!",
        };
      }

      // Calculate rewards
      let popGain = 0;
      let cashGain = 0;
      for (const g of state.guestsInHouse) {
        popGain += g.popularity;
        cashGain += g.cash;
      }

      const newPop = Math.min(
        state.popularity + popGain,
        state.maxPopularity
      );
      const newCash = Math.min(state.cash + cashGain, state.maxCash);

      return {
        ...state,
        phase: "party_ended",
        popularity: Math.max(0, newPop),
        cash: Math.max(0, newCash),
        caption: `YOU HAVE ENDED THE PARTY. +${popGain} POP, +${cashGain} CASH`,
      };
    }

    case "SELECT_ITEM":
      return {
        ...state,
        selectedItem: action.item,
      };

    case "BAN_GUEST": {
      // After a shutdown, ban one guest from next party
      const updatedRolodex = state.rolodex.map((g) =>
        g.id === action.guestId ? { ...g, banned: true } : g
      );
      return {
        ...state,
        phase: "party_ended",
        rolodex: updatedRolodex,
        caption: "GUEST BANNED. MOVING ON...",
      };
    }

    case "DISMISS": {
      // After party_ended, move to shop or next party
      if (state.phase === "party_ended") {
        // For now, go directly to the next party
        const nextPartyNum = state.partyNumber + 1;
        if (nextPartyNum > state.maxParties) {
          return {
            ...state,
            phase: "scenario_lost",
            caption: "OUT OF TIME! THE SUMMER IS OVER.",
          };
        }

        const availableGuests = state.rolodex.filter((g) => !g.banned);
        return {
          ...state,
          phase: "party",
          partyNumber: nextPartyNum,
          guestsInHouse: [],
          drawPile: shuffle(availableGuests),
          activeTroubleCount: 0,
          starsInHouse: 0,
          currentAction: "idle",
          peekedGuest: null,
          selectedItem: { kind: "front_door" },
          caption: `PARTY ${nextPartyNum} OF ${state.maxParties}. LET'S GO!`,
          turnsRemaining: state.maxParties - nextPartyNum + 1,
        };
      }
      return state;
    }

    default:
      return state;
  }
}
