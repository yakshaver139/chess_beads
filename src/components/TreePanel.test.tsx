import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TreePanel from "./TreePanel";
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

describe("TreePanel", () => {
  it("shows empty state when no openings", () => {
    render(<TreePanel openings={[]} onSelect={() => {}} selected={null} />);
    expect(screen.getByText("No openings match your filters.")).toBeTruthy();
  });

  it("renders first-level moves from the tree", () => {
    render(
      <TreePanel
        openings={[italian, english]}
        onSelect={() => {}}
        selected={null}
      />,
    );
    expect(screen.getByText("e4")).toBeTruthy();
    expect(screen.getByText("c4")).toBeTruthy();
  });

  it("shows opening name inline for leaf nodes with a single opening", () => {
    render(
      <TreePanel openings={[english]} onSelect={() => {}} selected={null} />,
    );
    expect(screen.getByText("c4")).toBeTruthy();
    expect(screen.getByText("English Opening")).toBeTruthy();
  });

  it("expands first-level nodes by default", () => {
    render(
      <TreePanel openings={[italian]} onSelect={() => {}} selected={null} />,
    );
    // e4 is first-level, should be expanded, so e5 should be visible
    expect(screen.getByText("e5")).toBeTruthy();
  });

  it("collapses a node when clicked", () => {
    render(
      <TreePanel openings={[italian]} onSelect={() => {}} selected={null} />,
    );
    // e4 expanded by default — e5 is visible
    expect(screen.getByText("e5")).toBeTruthy();

    // Click e4 to collapse
    fireEvent.click(screen.getByText("e4").closest(".tree-node-row")!);
    expect(screen.queryByText("e5")).toBeNull();
  });

  it("re-expands a collapsed node when clicked again", () => {
    render(
      <TreePanel openings={[italian]} onSelect={() => {}} selected={null} />,
    );
    const row = screen.getByText("e4").closest(".tree-node-row")!;

    // Collapse
    fireEvent.click(row);
    expect(screen.queryByText("e5")).toBeNull();

    // Re-expand
    fireEvent.click(row);
    expect(screen.getByText("e5")).toBeTruthy();
  });

  it("calls onSelect when a leaf opening is clicked", () => {
    const onSelect = vi.fn();
    render(
      <TreePanel openings={[english]} onSelect={onSelect} selected={null} />,
    );

    fireEvent.click(screen.getByText("c4").closest(".tree-node-row")!);
    expect(onSelect).toHaveBeenCalledWith(english);
  });

  it("highlights the selected opening on a leaf node", () => {
    render(
      <TreePanel
        openings={[english]}
        onSelect={() => {}}
        selected={english}
      />,
    );

    const row = screen.getByText("c4").closest(".tree-node-row")!;
    expect(row.classList.contains("tree-node-row--selected")).toBe(true);
  });

  it("does not highlight unselected nodes", () => {
    render(
      <TreePanel
        openings={[english, italian]}
        onSelect={() => {}}
        selected={english}
      />,
    );

    const c4Row = screen.getByText("c4").closest(".tree-node-row")!;
    expect(c4Row.classList.contains("tree-node-row--selected")).toBe(true);

    const e4Row = screen.getByText("e4").closest(".tree-node-row")!;
    expect(e4Row.classList.contains("tree-node-row--selected")).toBe(false);
  });

  it("shows a count badge when multiple openings share the same leaf", () => {
    const variant: Opening = {
      ...italian,
      name: "Giuoco Piano",
      eco: "C53",
    };
    render(
      <TreePanel
        openings={[italian, variant]}
        onSelect={() => {}}
        selected={null}
      />,
    );

    // Expand down to Bc4 — need to expand intermediate nodes
    // e4 is expanded by default, but deeper nodes are not
    // Expand e5
    fireEvent.click(screen.getByText("e5").closest(".tree-node-row")!);
    // Expand Nf3
    fireEvent.click(screen.getByText("Nf3").closest(".tree-node-row")!);
    // Expand Nc6
    fireEvent.click(screen.getByText("Nc6").closest(".tree-node-row")!);

    // Bc4 node should show count badge "2"
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("shows opening sub-items when a multi-opening node is expanded", () => {
    const variant: Opening = {
      ...italian,
      name: "Giuoco Piano",
      eco: "C53",
    };
    render(
      <TreePanel
        openings={[italian, variant]}
        onSelect={() => {}}
        selected={null}
      />,
    );

    // Expand to reach Bc4
    fireEvent.click(screen.getByText("e5").closest(".tree-node-row")!);
    fireEvent.click(screen.getByText("Nf3").closest(".tree-node-row")!);
    fireEvent.click(screen.getByText("Nc6").closest(".tree-node-row")!);

    // Bc4 has 2 openings but no children, and openings.length > 1
    // We need to expand it to see the sub-items
    fireEvent.click(screen.getByText("Bc4").closest(".tree-node-row")!);

    expect(screen.getByText("Italian Game")).toBeTruthy();
    expect(screen.getByText("Giuoco Piano")).toBeTruthy();
  });

  it("highlights a selected opening in a multi-opening list", () => {
    const variant: Opening = {
      ...italian,
      name: "Giuoco Piano",
      eco: "C53",
    };
    render(
      <TreePanel
        openings={[italian, variant]}
        onSelect={() => {}}
        selected={italian}
      />,
    );

    // Expand to reach Bc4 and its sub-items
    fireEvent.click(screen.getByText("e5").closest(".tree-node-row")!);
    fireEvent.click(screen.getByText("Nf3").closest(".tree-node-row")!);
    fireEvent.click(screen.getByText("Nc6").closest(".tree-node-row")!);
    fireEvent.click(screen.getByText("Bc4").closest(".tree-node-row")!);

    const italianItem = screen.getByText("Italian Game").closest(".tree-opening-item")!;
    expect(italianItem.classList.contains("tree-opening-item--selected")).toBe(true);

    const variantItem = screen.getByText("Giuoco Piano").closest(".tree-opening-item")!;
    expect(variantItem.classList.contains("tree-opening-item--selected")).toBe(false);
  });

  it("auto-expands all paths when isFiltered is true", () => {
    render(
      <TreePanel
        openings={[italian]}
        onSelect={() => {}}
        selected={null}
        isFiltered={true}
      />,
    );
    // All nodes should be visible without manual expanding
    expect(screen.getByText("e4")).toBeTruthy();
    expect(screen.getByText("e5")).toBeTruthy();
    expect(screen.getByText("Nf3")).toBeTruthy();
    expect(screen.getByText("Nc6")).toBeTruthy();
    expect(screen.getByText("Bc4")).toBeTruthy();
    expect(screen.getByText("Italian Game")).toBeTruthy();
  });

  it("preserves path to selected opening when filter is cleared", () => {
    const { rerender } = render(
      <TreePanel
        openings={[italian]}
        onSelect={() => {}}
        selected={italian}
        isFiltered={true}
      />,
    );
    // Verify Italian Game is visible while filtered
    expect(screen.getByText("Italian Game")).toBeTruthy();

    // Clear filter — now showing all three openings, Italian still selected
    rerender(
      <TreePanel
        openings={[italian, english, ruyLopez]}
        onSelect={() => {}}
        selected={italian}
        isFiltered={false}
      />,
    );
    // Path to selected opening should remain expanded
    expect(screen.getByText("Bc4")).toBeTruthy();
    expect(screen.getByText("Italian Game")).toBeTruthy();
    // English Opening is a first-level leaf, should also be visible
    expect(screen.getByText("English Opening")).toBeTruthy();
  });

  it("renders diverging branches (Italian + Ruy Lopez)", () => {
    render(
      <TreePanel
        openings={[italian, ruyLopez]}
        onSelect={() => {}}
        selected={null}
      />,
    );

    // Expand down to Nc6
    fireEvent.click(screen.getByText("e5").closest(".tree-node-row")!);
    fireEvent.click(screen.getByText("Nf3").closest(".tree-node-row")!);
    fireEvent.click(screen.getByText("Nc6").closest(".tree-node-row")!);

    // Should see both Bc4 and Bb5 as separate branches
    expect(screen.getByText("Bc4")).toBeTruthy();
    expect(screen.getByText("Bb5")).toBeTruthy();
    expect(screen.getByText("Italian Game")).toBeTruthy();
    expect(screen.getByText("Ruy Lopez")).toBeTruthy();
  });
});
