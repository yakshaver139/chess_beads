import type { Opening } from "./types";

export function filterOpenings(
  all: Opening[],
  query: string,
  firstMove: string | null,
): Opening[] {
  const q = query.toLowerCase().trim();
  return all.filter((o) => {
    if (firstMove && o.moves[0] !== firstMove) return false;
    if (q && !o.name.toLowerCase().includes(q) && !o.eco.toLowerCase().includes(q))
      return false;
    return true;
  });
}

export function getFirstMoves(openings: Opening[]): string[] {
  return [...new Set(openings.map((o) => o.moves[0]))].sort();
}
