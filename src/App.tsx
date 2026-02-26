import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TreePanel from "./components/TreePanel";
import DetailsPanel from "./components/DetailsPanel";
import type { Opening } from "./types";
import openings from "./data/openings";
import { filterOpenings, getFirstMoves } from "./filterOpenings";

export default function App() {
  const [query, setQuery] = useState("");
  const [firstMove, setFirstMove] = useState<string | null>(null);
  const [selected, setSelected] = useState<Opening | null>(null);

  const firstMoves = useMemo(() => getFirstMoves(openings), []);

  const filtered = useMemo(
    () => filterOpenings(openings, query, firstMove),
    [query, firstMove],
  );

  const isFiltered = query !== "" || firstMove !== null;

  // Clear selection when the selected opening is no longer in filtered results
  useEffect(() => {
    if (
      selected &&
      !filtered.some((o) => o.eco === selected.eco && o.name === selected.name)
    ) {
      setSelected(null);
    }
  }, [filtered, selected]);

  return (
    <div className="app">
      <Header
        query={query}
        onQueryChange={setQuery}
        firstMoves={firstMoves}
        activeFirstMove={firstMove}
        onFirstMoveChange={setFirstMove}
      />
      <main className="app-main">
        <TreePanel
          openings={filtered}
          onSelect={setSelected}
          selected={selected}
          isFiltered={isFiltered}
        />
        <DetailsPanel opening={selected} />
      </main>
    </div>
  );
}
