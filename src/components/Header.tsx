import { useState } from "react";

export default function Header() {
  const [query, setQuery] = useState("");

  return (
    <header className="header">
      <h1 className="header-title">Chess Beads</h1>
      <input
        className="header-search"
        type="search"
        placeholder="Search…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </header>
  );
}
