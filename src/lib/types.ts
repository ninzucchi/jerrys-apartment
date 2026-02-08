// ============================================================
// Party House – Core Game Types
// ============================================================

/** Every distinct guest archetype in the game. */
export type GuestType =
  // Default guests (always in starting rolodex)
  | "old_friend"
  | "rich_pal"
  | "wild_buddy"
  // Non-star purchasable guests
  | "driver"
  | "private_i"
  | "hippy"
  | "cute_dog"
  | "security"
  | "wrestler"
  | "watch_dog"
  | "spy"
  | "grillmaster"
  | "athlete"
  | "dancer"
  | "mr_popular"
  | "celebrity"
  | "ticket_taker"
  | "comedian"
  | "photographer"
  | "caterer"
  | "auctioneer"
  | "mascot"
  | "introvert"
  | "stylist"
  | "bartender"
  | "writer"
  | "climber"
  | "cheerleader"
  | "greeter"
  | "magician"
  | "cupid"
  | "counselor"
  | "werewolf"
  | "monkey"
  | "rock_star"
  | "gangster"
  | "gambler"
  // Star guests
  | "alien"
  | "leprechaun"
  | "genie"
  | "dragon"
  | "dinosaur"
  | "mermaid"
  | "ghost"
  | "unicorn"
  | "superhero";

/** Abilities a guest can have. */
export type AbilityType =
  | "trouble" // Counts toward police shutdown
  | "cancel_trouble" // Passively negates one trouble guest
  | "fetch" // Summon a specific guest from the rolodex
  | "boot" // Remove one guest from the party
  | "peek" // Look at the next guest before admitting
  | "shuffle" // Send all guests out and reshuffle
  | "bring_one" // Automatically brings +1 random guest
  | "bring_two" // Automatically brings +2 random guests
  | "photographer" // Capture one guest's reward immediately
  | "comedian" // +5 pop if party ends with no open spaces
  | "dancer" // Pop scales with number of dancers (1/4/9/16)
  | "mascot" // +1 pop per Old Friend in party
  | "introvert" // +1 pop per empty space in house
  | "stylist" // Permanently +1 pop to a guest
  | "bartender" // +2 cash per trouble in house
  | "writer" // +2 pop per trouble in house
  | "climber" // +1 pop each appearance (max 9)
  | "cheerleader" // Refresh all other guests' abilities
  | "greeter" // Admit next guest and score immediately
  | "magician" // Swap star guest ↔ non-star guest
  | "cupid" // Boot two adjacent guests
  | "counselor" // Remove trouble from all guests
  | "werewolf"; // Trouble every other appearance

/** Blueprint for a type of guest (immutable reference data). */
export interface GuestDefinition {
  type: GuestType;
  name: string;
  shopCost: number;
  basePopularity: number;
  baseCash: number;
  ability: AbilityType | null;
  isStar: boolean;
  /** Maximum copies purchasable in shop per scenario (stars unlimited). */
  maxCopies: number;
  /** Color used for the placeholder sprite. */
  color: string;
}

/**
 * A concrete guest instance that lives in the rolodex or the party.
 * Has runtime state on top of its definition.
 */
export interface Guest {
  /** Unique instance id. */
  id: string;
  /** Reference back to the definition. */
  type: GuestType;
  /** Display name. */
  name: string;
  /** Current popularity value (can be modified by Stylist, Climber, etc.). */
  popularity: number;
  /** Current cash value. */
  cash: number;
  /** The guest's ability, if any. */
  ability: AbilityType | null;
  /** Is this a star guest? */
  isStar: boolean;
  /** Has the guest's active ability been used this party? */
  abilityUsed: boolean;
  /** Is the trouble status currently active on this guest? */
  troubleActive: boolean;
  /** Is trouble cancelled (by Hippy, Cute Dog, Unicorn)? */
  troubleCancelled: boolean;
  /** For Climber: current pop level (increases each appearance). */
  climberLevel?: number;
  /** For Werewolf: tracks appearance count for alternating trouble. */
  werewolfAppearances?: number;
  /** Whether this guest is banned for the next party. */
  banned: boolean;
}

/** High-level game phases. */
export type GamePhase =
  | "title" // Title / start screen
  | "party" // Currently throwing a party
  | "party_ended" // Party just ended, showing results
  | "shutdown" // Party was shut down (police/fire), pick who to blame
  | "shop" // Buying guests between parties
  | "scenario_won" // Completed a scenario (4 stars at once)
  | "scenario_lost"; // Ran out of parties (25 max)

/** What the player is doing during the party phase. */
export type PartyAction =
  | "idle" // Waiting for player input
  | "admitting" // About to admit next guest
  | "peeking" // Looking at next guest (peek ability)
  | "selecting_target" // Choosing a guest for an ability (boot, fetch, etc.)
  | "selecting_pair" // Choosing two adjacent guests (cupid)
  | "animating"; // Brief pause for visual feedback

/** Represents a selectable object in the game scene. */
export type SelectableItem =
  | { kind: "guest"; guest: Guest }
  | { kind: "front_door" }
  | { kind: "none" };

/** The complete game state at any point in time. */
export interface GameState {
  // --- Scenario / meta ---
  phase: GamePhase;
  scenarioIndex: number; // 0-4 for the 5 scenarios
  partyNumber: number; // Current party within scenario (1-25)
  maxParties: number; // 25

  // --- Resources ---
  popularity: number;
  cash: number;
  /** Popularity needed to win (display purposes – actual win = 4 stars). */
  maxPopularity: number;
  /** Cash cap for display. */
  maxCash: number;

  // --- House ---
  houseSize: number; // Max guests allowed, starts at 5
  /** Next expansion cost (starts at $2, increments by $1, caps at $12). */
  nextExpansionCost: number;
  /** Guests currently inside the house. */
  guestsInHouse: Guest[];

  // --- Rolodex / deck ---
  /** Full rolodex of available guests for this scenario. */
  rolodex: Guest[];
  /** Shuffled draw pile for the current party. */
  drawPile: Guest[];

  // --- Stars ---
  /** How many star guests must be present at once to win. */
  starsRequired: number; // 4
  /** The two star guest types available in this scenario. */
  scenarioStarTypes: GuestType[];

  // --- Trouble ---
  /** Live count of unmitigated trouble guests in the house. */
  activeTroubleCount: number;
  /** Threshold that triggers police (always 3). */
  troubleLimit: number;

  // --- Party action state ---
  currentAction: PartyAction;
  /** Guest being peeked at, if any. */
  peekedGuest: Guest | null;

  // --- UI state ---
  selectedItem: SelectableItem;
  caption: string;
  /** Stars earned so far in this party (count of star guests present). */
  starsInHouse: number;

  // --- Turns ---
  turnsRemaining: number;
}

/** Actions the player can dispatch to the game reducer. */
export type GameAction =
  | { type: "START_GAME" }
  | { type: "OPEN_DOOR" } // Admit next guest
  | { type: "END_PARTY" }
  | { type: "USE_ABILITY"; guestId: string }
  | { type: "SELECT_TARGET"; guestId: string } // For fetch / boot / etc.
  | { type: "SELECT_ITEM"; item: SelectableItem }
  | { type: "PEEK_ACCEPT" }
  | { type: "PEEK_REJECT" }
  | { type: "BAN_GUEST"; guestId: string } // After shutdown
  | { type: "BUY_GUEST"; guestType: GuestType }
  | { type: "EXPAND_HOUSE" }
  | { type: "END_SHOP" } // Move to next party
  | { type: "NEXT_SCENARIO" }
  | { type: "DISMISS" }; // Dismiss results screen, etc.
