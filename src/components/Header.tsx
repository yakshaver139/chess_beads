interface HeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  firstMoves: string[];
  activeFirstMove: string | null;
  onFirstMoveChange: (move: string | null) => void;
}

export default function Header({
  query,
  onQueryChange,
  firstMoves,
  activeFirstMove,
  onFirstMoveChange,
}: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header-title">Chess Beads</h1>
      <input
        className="header-search"
        type="search"
        placeholder="Search name or ECO…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <div className="first-move-filters">
        {firstMoves.map((move) => (
          <button
            key={move}
            className={`filter-btn${activeFirstMove === move ? " filter-btn--active" : ""}`}
            onClick={() =>
              onFirstMoveChange(activeFirstMove === move ? null : move)
            }
          >
            {move}
          </button>
        ))}
      </div>
    </header>
  );
}
