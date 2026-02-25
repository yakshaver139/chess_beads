import type { Opening } from "../types";

interface TreePanelProps {
  onSelect: (opening: Opening) => void;
}

export default function TreePanel({ onSelect: _onSelect }: TreePanelProps) {
  return (
    <aside className="tree-panel">
      <h2>Tree</h2>
      <p className="placeholder">Opening tree will appear here</p>
    </aside>
  );
}
