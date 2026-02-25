import { describe, it, expect } from "vitest";
import { movesToPgn } from "./utils";

describe("movesToPgn", () => {
  it("formats a full move pair", () => {
    expect(movesToPgn(["e4", "e5"])).toBe("1. e4 e5");
  });

  it("formats multiple move pairs", () => {
    expect(movesToPgn(["e4", "e5", "Nf3", "Nc6", "Bc4"])).toBe(
      "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    );
  });

  it("returns empty string for empty array", () => {
    expect(movesToPgn([])).toBe("");
  });

  it("handles a single white move", () => {
    expect(movesToPgn(["d4"])).toBe("1. d4");
  });
});
