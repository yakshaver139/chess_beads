import { describe, expect, it } from "vitest";
import { filterOpenings, getFirstMoves } from "./filterOpenings";
import type { Opening } from "./types";

const openings: Opening[] = [
  {
    name: "Italian Game",
    eco: "C50",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    ideas: "Develop quickly",
    style: "classical",
    famous: ["Morphy"],
  },
  {
    name: "Sicilian Najdorf",
    eco: "B90",
    moves: ["e4", "c5", "Nf3", "d6"],
    ideas: "Fight for queenside counterplay",
    style: "aggressive",
    famous: ["Fischer"],
  },
  {
    name: "Queen's Gambit Declined",
    eco: "D30",
    moves: ["d4", "d5", "c4", "e6"],
    ideas: "Classical approach",
    style: "positional",
    famous: ["Karpov"],
  },
  {
    name: "English Opening",
    eco: "A10",
    moves: ["c4"],
    ideas: "Flexible flank opening",
    style: "flexible",
    famous: ["Botvinnik"],
  },
];

describe("filterOpenings", () => {
  it("returns all openings with no filters", () => {
    expect(filterOpenings(openings, "", null)).toHaveLength(4);
  });

  it("filters by text search on name (case-insensitive)", () => {
    const result = filterOpenings(openings, "italian", null);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Italian Game");
  });

  it("filters by text search on ECO code", () => {
    const result = filterOpenings(openings, "b90", null);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Sicilian Najdorf");
  });

  it("filters by first move", () => {
    const result = filterOpenings(openings, "", "e4");
    expect(result).toHaveLength(2);
    expect(result.map((o) => o.name)).toEqual([
      "Italian Game",
      "Sicilian Najdorf",
    ]);
  });

  it("combines text search and first-move filter", () => {
    const result = filterOpenings(openings, "sicilian", "e4");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Sicilian Najdorf");
  });

  it("returns empty array when nothing matches", () => {
    expect(filterOpenings(openings, "xyz", null)).toHaveLength(0);
  });

  it("returns empty when text matches but first move does not", () => {
    expect(filterOpenings(openings, "italian", "d4")).toHaveLength(0);
  });

  it("trims whitespace from query", () => {
    const result = filterOpenings(openings, "  italian  ", null);
    expect(result).toHaveLength(1);
  });

  it("matches partial ECO codes", () => {
    const result = filterOpenings(openings, "c5", null);
    expect(result).toHaveLength(1);
    expect(result[0].eco).toBe("C50");
  });
});

describe("getFirstMoves", () => {
  it("returns sorted unique first moves", () => {
    expect(getFirstMoves(openings)).toEqual(["c4", "d4", "e4"]);
  });

  it("returns empty array for empty input", () => {
    expect(getFirstMoves([])).toEqual([]);
  });
});
