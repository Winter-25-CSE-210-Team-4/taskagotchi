import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login.jsx";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

beforeEach(() => {
    Object.defineProperty(global, "localStorage", {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });
  

afterEach(() => {
  vi.clearAllMocks();
});

describe("Login Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  it("renders form correctly", () => {
    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create Account" })).toBeInTheDocument();
  });

  it("takes user input", () => {
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("shows errors on empty form submission", async () => {
    fireEvent.submit(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows error on invalid login", async () => {
    axios.post.mockRejectedValue(new Error("Invalid email or password"));

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("logs in successfully and stores token", async () => {
    axios.post.mockResolvedValue({
      data: { token: "mockToken", user: { email: "test@example.com" } },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "mockToken");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({ email: "test@example.com" })
      );
    });
  });
});
