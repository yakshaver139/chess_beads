import { useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import type { Opening } from "../types";
import { movesToFen, movesToPgn } from "../utils";

interface DetailsPanelProps {
  opening: Opening | null;
}

export default function DetailsPanel({ opening }: DetailsPanelProps) {
  const [copied, setCopied] = useState(false);

  const fen = useMemo(
    () => (opening ? movesToFen(opening.moves) : undefined),
    [opening],
  );

  if (!opening) {
    return (
      <section className="details-panel">
        <div className="empty-state-card">
          <span className="empty-state-icon" aria-hidden="true">&#9822;</span>
          <p className="placeholder">Select an opening to view details</p>
          <p className="empty-state-hint">Click any opening in the tree to explore its moves, ideas, and famous practitioners.</p>
        </div>
      </section>
    );
  }

  const pgn = movesToPgn(opening.moves);

  async function handleCopy() {
    await navigator.clipboard.writeText(pgn);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="details-panel">
      <h2 className="details-name">{opening.name}</h2>
      <span className="details-eco">{opening.eco}</span>

      <div className="details-board">
        <Chessboard
          options={{
            position: fen,
            allowDragging: false,
            darkSquareStyle: { backgroundColor: "#779952" },
            lightSquareStyle: { backgroundColor: "#edeed1" },
          }}
        />
      </div>

      <div className="details-moves">{pgn}</div>

      <dl className="details-meta">
        <dt>Style</dt>
        <dd className="details-style">{opening.style}</dd>

        <dt>Ideas</dt>
        <dd>{opening.ideas}</dd>

        <dt>Famous players</dt>
        <dd>{opening.famous.join(", ")}</dd>
      </dl>

      <button className="details-copy" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy PGN"}
      </button>
    </section>
  );
}
