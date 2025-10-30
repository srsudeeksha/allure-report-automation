// __tests__/Login.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "../pages/Login";
import { authAPI } from "../services/api";
import * as router from "react-router-dom"; // Import router for type definition

// 1. Mock API
const mockLogin = vi.spyOn(authAPI, "login");
// 2. Mock Navigation
const mockNavigate = vi.fn();

// ✅ Mock react-router-dom's useNavigate
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof router>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ✅ Helper function to render the component
const renderComponent = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

// --- Test Suite ---
describe("Login Component", () => {
  // Clear mocks and sessionStorage after each test
  afterEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  // ---------------------------------------------------------------------
  // 1. Rendering and Validation Tests (L-R1, L-V1, L-V4)
  // ---------------------------------------------------------------------

  it("L-R1: renders login form with all required elements", () => {
    renderComponent();

    // Header elements
    expect(screen.getByText(/Welcome to Weather App/i)).toBeInTheDocument();

    // Input fields
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    // Button
    const signInButton = screen.getByRole("button", { name: /Sign In/i });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).not.toBeDisabled();

    // Register link
    expect(screen.getByRole("link", { name: /Create one/i })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  it("L-V1: shows error message when fields are empty on submit", async () => {
    renderComponent();
    const signInButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.click(signInButton);

    const errorMessage = await screen.findByText("Please fill in all fields");
    expect(errorMessage).toBeInTheDocument();

    // Clear error when user types
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "a" } });
    expect(screen.queryByText("Please fill in all fields")).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------
  // 2. Successful Submission Tests (L-S1, L-S2, L-S3, L-S4)
  // ---------------------------------------------------------------------

  it("L-S1, L-S2, L-S3, L-S4: successfully logs in, stores data, and navigates", async () => {
    mockLogin.mockResolvedValueOnce({
      token: "mock-auth-token",
      user: { id: 101, username: "testuser", email: "user@test.com" },
    });

    renderComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "mysecretpass" },
    });

    const signInButton = screen.getByRole("button", { name: /Sign In/i });

    fireEvent.click(signInButton);
    expect(signInButton).toBeDisabled();
    expect(signInButton).toHaveTextContent("Signing in...");

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith("user@test.com", "mysecretpass");
    });

    // ✅ Verify sessionStorage update instead of localStorage
    expect(sessionStorage.getItem("token")).toBe("mock-auth-token");
    expect(sessionStorage.getItem("user")).toBe(
      JSON.stringify({ id: 101, username: "testuser", email: "user@test.com" })
    );

    // ✅ Redirect
    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });

  // ---------------------------------------------------------------------
  // 3. Failure Handling Tests (L-F1, L-F2, L-F3, L-F4)
  // ---------------------------------------------------------------------

  it("L-F1, L-F3, L-F4: handles generic API login failure correctly", async () => {
    mockLogin.mockRejectedValueOnce({
      response: { status: 401 },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });

    const signInButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(
        screen.getByText("Invalid credentials. Please try again.")
      ).toBeInTheDocument();
    });

    expect(signInButton).not.toBeDisabled();
    expect(signInButton).toHaveTextContent("Sign In");

    // ✅ Check no session data stored
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("L-F2: displays specific error message from the API", async () => {
    const specificError = "Your account has been temporarily locked.";

    mockLogin.mockRejectedValueOnce({
      response: { data: { message: specificError } },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "locked@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(specificError)).toBeInTheDocument();
    });
  });
});