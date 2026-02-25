import type { Opening, TreeNode } from "../types";

/** Create an empty tree node. */
function createNode(move: string | null): TreeNode {
  return { move, children: {}, openings: [] };
}

/**
 * Build a deterministic move tree from a list of openings.
 *
 * Each opening's `moves` array is walked move-by-move, creating
 * intermediate nodes as needed. The opening is attached to the
 * node representing its final move.
 */
export function buildTree(openings: Opening[]): TreeNode {
  const root = createNode(null);

  for (const opening of openings) {
    let current = root;
    for (const move of opening.moves) {
      if (!current.children[move]) {
        current.children[move] = createNode(move);
      }
      current = current.children[move];
    }
    current.openings.push(opening);
  }

  return root;
}
