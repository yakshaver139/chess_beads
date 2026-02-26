import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

describe("App state management", () => {
  it("selecting a tree opening updates the details panel", () => {
    render(<App />);

    // English Opening is a leaf at c4 — find the tree-move (not filter button)
    const c4Move = screen
      .getAllByText("c4")
      .find((el) => el.classList.contains("tree-move"))!;
    fireEvent.click(c4Move.closest(".tree-node-row")!);

    // Details panel should show English Opening info
    expect(screen.getByText("A10")).toBeTruthy(); // ECO badge
    expect(screen.getByText("flexible")).toBeTruthy(); // style
  });

  it("clears selection when selected opening is filtered out", () => {
    render(<App />);

    // Select English Opening (c4 leaf)
    const c4Move = screen
      .getAllByText("c4")
      .find((el) => el.classList.contains("tree-move"))!;
    fireEvent.click(c4Move.closest(".tree-node-row")!);

    // Verify it's selected — ECO badge visible
    expect(screen.getByText("A10")).toBeTruthy();

    // Search for "sicilian" — English Opening doesn't match
    act(() => {
      fireEvent.change(screen.getByPlaceholderText("Search name or ECO…"), {
        target: { value: "sicilian" },
      });
    });

    // Details panel should show placeholder
    expect(
      screen.getByText("Select an opening to view details"),
    ).toBeTruthy();
  });

  it("keeps selection when it still matches the filter", () => {
    render(<App />);

    // Select English Opening
    const c4Move = screen
      .getAllByText("c4")
      .find((el) => el.classList.contains("tree-move"))!;
    fireEvent.click(c4Move.closest(".tree-node-row")!);
    expect(screen.getByText("A10")).toBeTruthy();

    // Search for "english" — English Opening still matches
    act(() => {
      fireEvent.change(screen.getByPlaceholderText("Search name or ECO…"), {
        target: { value: "english" },
      });
    });

    // Selection should persist — ECO badge still visible
    expect(screen.getByText("A10")).toBeTruthy();
  });
});
