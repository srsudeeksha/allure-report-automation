import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Login from "../pages/Login"; 
import { waitFor } from "@testing-library/react";


// ✅ Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Page", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("successful login navigates to /home", async () => {
    const mockResponse = { token: "mock-token" };

    // ✅ Mock fetch success
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as unknown as typeof fetch;

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123", name: "password" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mock-token");
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  test("shows error when login fails", async () => {
    // ✅ Mock failed fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid credentials" }),
      })
    ) as unknown as typeof fetch;

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "wrong@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass", name: "password" },
    });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Wait for alert
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("shows error if fetch throws an exception", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error"))) as unknown as typeof fetch;

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});
