/** Style categories for chess openings. */
export type OpeningStyle =
  | "classical"
  | "positional"
  | "aggressive"
  | "solid"
  | "flexible";

/** A single chess opening record (matches openings.json shape). */
export interface Opening {
  name: string;
  eco: string;
  moves: string[];
  ideas: string;
  style: OpeningStyle;
  famous: string[];
}

/**
 * A node in the opening move tree.
 *
 * Each node represents one move (e.g. "e4"). Children are keyed by
 * move string so lookup is O(1). Leaf or intermediate nodes may
 * reference openings that pass through (or terminate at) this position.
 */
export interface TreeNode {
  /** The move this node represents (e.g. "e4"). Null for the root. */
  move: string | null;
  /** Child nodes keyed by move string. */
  children: Record<string, TreeNode>;
  /** Openings whose move sequence ends exactly at this node. */
  openings: Opening[];
}
