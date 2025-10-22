import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, beforeEach, vi, expect } from "vitest";
// Update the import path below if the Home component is located elsewhere
// Update the import path below to the correct location of your Home component
import Home from "../pages/Home"; // e.g., if Home.tsx is in src/pages/

// Create a spy function
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // return the spy
  };
});



// NEW: Mock the components imported with the alias (@/) for testing
vi.mock("@/components/ui/card", () => ({
    Card: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-card">{children}</div>,
    CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    CardTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
    Button: ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
        <button onClick={onClick}>{children}</button>
    ),
}));


describe("Home Page", () => {
  beforeEach(() => {
    // Set a fake token for testing
    localStorage.setItem("token", "sample-token");
    mockNavigate.mockReset();
  });

  test("renders Home page content correctly", () => {
    render(
    <MemoryRouter>
        <Home />
    </MemoryRouter>
    );


    // Check if welcome text is displayed
    expect(screen.getByText(/Welcome Home!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You are successfully logged in 🎉/i)
    ).toBeInTheDocument();

    // Check if Logout button exists
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  test("logs out user and navigates to login page", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole("button", { name: /logout/i });

    // Click Logout
    fireEvent.click(logoutButton);

    // Token should be removed from localStorage
    expect(localStorage.getItem("token")).toBeNull();

    // Should navigate to login page
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});