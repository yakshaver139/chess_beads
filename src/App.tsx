import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TreePanel from "./components/TreePanel";
import DetailsPanel from "./components/DetailsPanel";
import type { Opening } from "./types";

export default function App() {
  const [selected, setSelected] = useState<Opening | null>(null);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <TreePanel onSelect={setSelected} />
        <DetailsPanel opening={selected} />
      </main>
    </div>
  );
}
