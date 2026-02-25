#!/usr/bin/env bash
set -euo pipefail

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing dependency: $1" >&2; exit 1; }; }
need bd
need jq

PROJECT="Chess Openings Explorer UI (Demo)"

echo "==> Creating Beadloom demo project tasks: $PROJECT"

create_task () {
  local title="$1"
  local desc="$2"
  bd create \
    --title "$title" \
    --description "$desc" \
    --type task \
    --priority 2 >/dev/null
  echo "  + $title"
}

get_id_by_title() {
  local title="$1"
  local line
  line="$(bd list | grep -F " - ${title}" | head -n 1 || true)"
  if [[ -z "${line}" ]]; then
    echo "ERROR: Could not find issue with title: ${title}" >&2
    echo "Hint: run 'bd list' and verify the exact title text matches." >&2
    exit 1
  fi
}

# --- Create tasks ---
create_task "Scaffold React app (Vite + TS)" \
"Create a minimal Vite React + TypeScript app. Include basic folder structure and a single App route.
Acceptance:
- \`npm i\` and \`npm run dev\` works
- App renders a placeholder layout."

create_task "Add base UI layout shell" \
"Implement a simple 2-column layout:
- Left: Tree panel
- Right: Details panel
- Top: Header with search box
Acceptance:
- Layout responsive enough for demo
- Placeholder components visible."

create_task "Add curated openings dataset (JSON)" \
"Create \`src/data/openings.json\` with ~12 curated openings (name, ECO, moves, ideas, style, famous).
Acceptance:
- JSON loads in the app (imported or fetched locally)
- Data is typed in TS later."

create_task "Define TypeScript types for openings + tree" \
"Add TS types/interfaces for:
- Opening record
- Tree node structure
Acceptance:
- Types compile cleanly
- Openings data is typed when used."

create_task "Build tree index from openings dataset" \
"Create a small function that converts the list of openings (move sequences) into a nested tree structure.
Each node represents a move; leaf nodes can reference one or more openings.
Acceptance:
- Tree generation is deterministic
- Handles openings of differing depth."

create_task "Tree UI component (expand/collapse + selection)" \
"Render the derived move tree in the left panel with expand/collapse.
Clicking a node selects it and shows line/available openings.
Acceptance:
- Expand/collapse works
- Selected node is highlighted."

create_task "Search + filters (name/ECO/first move)" \
"Add a search input + optional filters:
- text search across name + ECO
- first-move filter (e4/d4/c4/Nf3) derived from data
Acceptance:
- Filtering updates results instantly
- Empty state shown when no match."

create_task "Opening details panel" \
"Implement right-side panel showing selected opening:
- Name, ECO, moves line
- Style, ideas, famous players
- Button: Copy PGN line (simple joined move list)
Acceptance:
- Displays correctly from selection
- Copy works."

create_task "Wire app state (tree selection + search + details)" \
"Implement app state management:
- Selecting a tree node updates details / possible openings
- Selecting from search results updates details + highlights in tree where possible
Acceptance:
- No inconsistent state
- Smooth demo flow."

create_task "Polish UX + demo-ready README" \
"Add basic UX polish:
- nice empty states
- small spacing/typography improvements
- README with quickstart + demo script (what to click)
Acceptance:
- \`npm run build\` succeeds
- README explains how to demo in <2 minutes."

# --- Helper to map titles -> ids ---
# --- Helper to map titles -> ids using plain `bd list` ---
get_id_by_title() {
  local title="$1"
  local line

  # Find the first line that contains " - <title>"
  line="$(bd list | grep -F " - ${title}" | head -n 1 || true)"

  if [[ -z "${line}" ]]; then
    echo "ERROR: Could not find issue with title: ${title}" >&2
    echo "Hint: run 'bd list' and verify the exact title text matches." >&2
    exit 1
  fi

  # Extract ID prefix (handles chess-xxx, compound-xxx, etc.)
  echo "${line}" | grep -Eo '[a-zA-Z0-9_-]+-[a-z0-9]+' | head -n 1
}

dep () {
  local child_title="$1"
  local parent_title="$2"

  local child_id parent_id
  child_id="$(get_id_by_title "$child_title")"
  parent_id="$(get_id_by_title "$parent_title")"

  if [[ -z "${child_id}" ]]; then
    echo "ERROR: Could not resolve child id for: ${child_title}" >&2
    exit 1
  fi

  if [[ -z "${parent_id}" ]]; then
    echo "ERROR: Could not resolve parent id for: ${parent_title}" >&2
    exit 1
  fi

  bd dep add "$child_id" "$parent_id" >/dev/null
  echo "  dep: '$child_title' <- '$parent_title'"
}


echo "==> Wiring dependencies"

# Layout depends on scaffold
dep "Add base UI layout shell" "Scaffold React app (Vite + TS)"

# Types depend on scaffold + dataset
dep "Define TypeScript types for openings + tree" "Scaffold React app (Vite + TS)"
dep "Define TypeScript types for openings + tree" "Add curated openings dataset (JSON)"

# Tree index depends on types + dataset
dep "Build tree index from openings dataset" "Define TypeScript types for openings + tree"
dep "Build tree index from openings dataset" "Add curated openings dataset (JSON)"

# Tree UI depends on tree index + layout
dep "Tree UI component (expand/collapse + selection)" "Build tree index from openings dataset"
dep "Tree UI component (expand/collapse + selection)" "Add base UI layout shell"

# Search depends on types + dataset + layout
dep "Search + filters (name/ECO/first move)" "Define TypeScript types for openings + tree"
dep "Search + filters (name/ECO/first move)" "Add curated openings dataset (JSON)"
dep "Search + filters (name/ECO/first move)" "Add base UI layout shell"

# Details depends on types + dataset + layout
dep "Opening details panel" "Define TypeScript types for openings + tree"
dep "Opening details panel" "Add curated openings dataset (JSON)"
dep "Opening details panel" "Add base UI layout shell"

# Wiring depends on all UI pieces
dep "Wire app state (tree selection + search + details)" "Tree UI component (expand/collapse + selection)"
dep "Wire app state (tree selection + search + details)" "Search + filters (name/ECO/first move)"
dep "Wire app state (tree selection + search + details)" "Opening details panel"

# Polish depends on wiring
dep "Polish UX + demo-ready README" "Wire app state (tree selection + search + details)"

echo "==> Done. Now run:"
echo "    bd tree"
echo "    bd cpa"
