import { Chess } from "chess.js";

/** Convert a move array to PGN-style string: "1. e4 e5 2. Nf3 Nc6" */
export function movesToPgn(moves: string[]): string {
  return moves
    .map((m, i) => (i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ${m}` : m))
    .join(" ");
}

/** Convert a move array to a FEN string representing the final position. */
export function movesToFen(moves: string[]): string {
  const game = new Chess();
  for (const move of moves) {
    game.move(move);
  }
  return game.fen();
}
