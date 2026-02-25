import { describe, it, expect } from "vitest";
import { buildTree } from "./buildTree";
import type { Opening } from "../types";

const italian: Opening = {
  name: "Italian Game",
  eco: "C50",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
  ideas: "Develop quickly",
  style: "classical",
  famous: ["Morphy"],
};

const ruyLopez: Opening = {
  name: "Ruy Lopez",
  eco: "C60",
  moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
  ideas: "Pressure e5",
  style: "positional",
  famous: ["Capablanca"],
};

const english: Opening = {
  name: "English Opening",
  eco: "A10",
  moves: ["c4"],
  ideas: "Flexible flank opening",
  style: "flexible",
  famous: ["Botvinnik"],
};

const french: Opening = {
  name: "French Defense",
  eco: "C00",
  moves: ["e4", "e6", "d4", "d5"],
  ideas: "Solid structure",
  style: "solid",
  famous: ["Botvinnik"],
};

describe("buildTree", () => {
  it("returns a root node with null move and no openings", () => {
    const root = buildTree([]);
    expect(root.move).toBeNull();
    expect(root.openings).toEqual([]);
    expect(root.children).toEqual({});
  });

  it("creates a linear chain for a single opening", () => {
    const root = buildTree([english]);
    expect(Object.keys(root.children)).toEqual(["c4"]);
    const c4 = root.children["c4"];
    expect(c4.move).toBe("c4");
    expect(c4.openings).toEqual([english]);
    expect(c4.children).toEqual({});
  });

  it("shares prefix nodes for openings that diverge", () => {
    const root = buildTree([italian, ruyLopez]);

    // Shared prefix: e4 -> e5 -> Nf3 -> Nc6
    const nc6 = root.children["e4"].children["e5"].children["Nf3"].children["Nc6"];
    expect(nc6.openings).toEqual([]); // no opening ends here

    // Divergence at move 5
    expect(Object.keys(nc6.children).sort()).toEqual(["Bb5", "Bc4"]);
    expect(nc6.children["Bc4"].openings).toEqual([italian]);
    expect(nc6.children["Bb5"].openings).toEqual([ruyLopez]);
  });

  it("handles openings of differing depth under the same first move", () => {
    const root = buildTree([english, italian]);

    // English ends at c4 (depth 1)
    expect(root.children["c4"].openings).toEqual([english]);

    // Italian ends at Bc4 (depth 5)
    const bc4 = root.children["e4"].children["e5"].children["Nf3"].children["Nc6"].children["Bc4"];
    expect(bc4.openings).toEqual([italian]);
  });

  it("is deterministic — same input produces identical output", () => {
    const list = [italian, ruyLopez, english, french];
    const a = buildTree(list);
    const b = buildTree(list);
    expect(a).toEqual(b);
  });

  it("places multiple openings on the same leaf when moves are identical", () => {
    const variant: Opening = {
      ...italian,
      name: "Giuoco Piano",
      eco: "C53",
    };
    const root = buildTree([italian, variant]);
    const leaf = root.children["e4"].children["e5"].children["Nf3"].children["Nc6"].children["Bc4"];
    expect(leaf.openings).toHaveLength(2);
    expect(leaf.openings[0].name).toBe("Italian Game");
    expect(leaf.openings[1].name).toBe("Giuoco Piano");
  });

  it("works with the full dataset shape without throwing", () => {
    // Smoke test: build from a mix of depths
    const all = [italian, ruyLopez, english, french];
    expect(() => buildTree(all)).not.toThrow();

    const root = buildTree(all);
    // Two top-level moves: e4, c4
    expect(Object.keys(root.children).sort()).toEqual(["c4", "e4"]);
  });
});
