<<<<<<< HEAD
import { useState } from "react";
=======
import { useMemo, useState } from "react";
>>>>>>> beadloom/chess-vez
import "./App.css";
import Header from "./components/Header";
import TreePanel from "./components/TreePanel";
import DetailsPanel from "./components/DetailsPanel";
<<<<<<< HEAD
import type { Opening } from "./types";

export default function App() {
  const [selected, setSelected] = useState<Opening | null>(null);
=======
import openings from "./data/openings";
import { filterOpenings, getFirstMoves } from "./filterOpenings";

export default function App() {
  const [query, setQuery] = useState("");
  const [firstMove, setFirstMove] = useState<string | null>(null);

  const firstMoves = useMemo(() => getFirstMoves(openings), []);

  const filtered = useMemo(
    () => filterOpenings(openings, query, firstMove),
    [query, firstMove],
  );
>>>>>>> beadloom/chess-vez

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
<<<<<<< HEAD
        <TreePanel onSelect={setSelected} />
        <DetailsPanel opening={selected} />
=======
        <TreePanel openings={filtered} />
        <DetailsPanel />
>>>>>>> beadloom/chess-vez
      </main>
    </div>
  );
}
