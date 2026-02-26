# Chess Beads

Interactive chess opening explorer. Search, filter, and study 97 openings in an
expandable move tree with details, PGN copy, and first-move quick filters.

## Quickstart

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

## Demo script (< 2 minutes)

1. **Browse the tree** — The left panel shows an expandable move tree.
   Click **e4** to expand it, then click down through **e5 > Nf3 > Nc6**.
   You'll see branches diverge into the Italian Game (Bc4) and Ruy Lopez (Bb5).

2. **View opening details** — Click **Bc4 / Italian Game**. The right panel
   shows the opening name, ECO code (C50), PGN moves, style, strategic ideas,
   and famous practitioners.

3. **Copy PGN** — Click the **Copy PGN** button. Paste it into any chess tool
   (Lichess, Chess.com analysis board, etc.).

4. **Search** — Type `sicilian` in the search bar. The tree auto-expands to
   show all Sicilian variants. Clear the search to return to the full tree.

5. **Filter by first move** — Click the **d4** button in the header. Only
   openings starting with 1. d4 are shown. Click **d4** again to clear.

6. **Combine filters** — With **e4** selected as the first-move filter,
   type `french` in search. Only the French Defense appears.

## Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start Vite dev server              |
| `npm run build`  | Type-check and production build    |
| `npm run preview`| Preview the production build       |
| `npm test`       | Run tests (Vitest)                 |

## Tech stack

- React 19 + TypeScript
- Vite
- Vitest + React Testing Library
- Plain CSS (no frameworks)
