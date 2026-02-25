import type { Opening } from "../types";

interface TreePanelProps {
  onSelect: (opening: Opening) => void;
  openings: Opening[];
}

export default function TreePanel({ openings }: TreePanelProps) {
  return (
    <aside className="tree-panel">
      <h2>Openings</h2>
      {openings.length === 0 ? (
        <p className="empty-state">No openings match your filters.</p>
      ) : (
        <ul className="openings-list">
          {openings.map((o) => (
            <li key={o.eco + o.name} className="opening-item">
              <span className="opening-eco">{o.eco}</span>
              <span className="opening-name">{o.name}</span>
              <span className={`opening-style opening-style--${o.style}`}>
                {o.style}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
