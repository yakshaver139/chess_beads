/** Convert a move array to PGN-style string: "1. e4 e5 2. Nf3 Nc6" */
export function movesToPgn(moves: string[]): string {
  return moves
    .map((m, i) => (i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ${m}` : m))
    .join(" ");
}
