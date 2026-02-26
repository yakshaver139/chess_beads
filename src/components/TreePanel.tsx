import { useCallback, useMemo, useState } from "react";
import type { Opening, TreeNode } from "../types";
import { buildTree } from "../data/buildTree";

interface TreePanelProps {
  openings: Opening[];
  onSelect: (opening: Opening) => void;
  selected: Opening | null;
}

function isSelected(a: Opening, b: Opening | null): boolean {
  return b !== null && a.eco === b.eco && a.name === b.name;
}

function NodeView({
  node,
  path,
  depth,
  expanded,
  onToggle,
  onSelect,
  selected,
}: {
  node: TreeNode;
  path: string;
  depth: number;
  expanded: Set<string>;
  onToggle: (path: string) => void;
  onSelect: (opening: Opening) => void;
  selected: Opening | null;
}) {
  const childKeys = Object.keys(node.children);
  const hasChildren = childKeys.length > 0;
  const isOpen = expanded.has(path);
  const { openings } = node;
  const isLeaf = !hasChildren;
  const soleOpening = isLeaf && openings.length === 1 ? openings[0] : null;
  const isActive = soleOpening ? isSelected(soleOpening, selected) : false;

  const expandable = hasChildren || openings.length > 1;

  function handleRowClick() {
    if (expandable) onToggle(path);
    if (soleOpening) onSelect(soleOpening);
  }

  return (
    <li className="tree-node">
      <div
        className={`tree-node-row${isActive ? " tree-node-row--selected" : ""}`}
        onClick={handleRowClick}
        role="treeitem"
        aria-expanded={expandable ? isOpen : undefined}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {expandable ? (
          <span className="tree-toggle">{isOpen ? "\u25be" : "\u25b8"}</span>
        ) : (
          <span className="tree-toggle tree-toggle--leaf" />
        )}
        <span className="tree-move">{node.move}</span>
        {soleOpening && (
          <span className="tree-opening-label">{soleOpening.name}</span>
        )}
        {openings.length > 1 && (
          <span className="tree-count">{openings.length}</span>
        )}
      </div>

      {/* Opening sub-items when a branch node has openings */}
      {openings.length > 0 && (!isLeaf || openings.length > 1) && isOpen && (
        <ul className="tree-opening-list">
          {openings.map((o) => (
            <li
              key={o.eco + o.name}
              className={`tree-opening-item${isSelected(o, selected) ? " tree-opening-item--selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(o);
              }}
              style={{ paddingLeft: `${(depth + 1) * 16 + 24}px` }}
            >
              <span className="tree-opening-eco">{o.eco}</span>
              {o.name}
            </li>
          ))}
        </ul>
      )}

      {hasChildren && isOpen && (
        <ul className="tree-children" role="group">
          {childKeys.map((key) => (
            <NodeView
              key={key}
              node={node.children[key]}
              path={`${path}/${key}`}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TreePanel({
  openings,
  onSelect,
  selected,
}: TreePanelProps) {
  const tree = useMemo(() => buildTree(openings), [openings]);

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const init = new Set<string>();
    for (const key of Object.keys(tree.children)) {
      init.add(`/${key}`);
    }
    return init;
  });

  const handleToggle = useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const childKeys = Object.keys(tree.children);

  return (
    <aside className="tree-panel">
      <h2>Openings</h2>
      {childKeys.length === 0 ? (
        <p className="empty-state">No openings match your filters.</p>
      ) : (
        <ul className="tree-root" role="tree">
          {childKeys.map((key) => (
            <NodeView
              key={key}
              node={tree.children[key]}
              path={`/${key}`}
              depth={0}
              expanded={expanded}
              onToggle={handleToggle}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </ul>
      )}
    </aside>
  );
}
