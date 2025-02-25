import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "/Users/siyarajpal/Desktop/Winter 25/CSE 210/taskagotchi/frontend/src/pages/Signup.jsx";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ message: "User registered successfully" }),
    });
  });
  
  afterEach(() => {
    vi.restoreAllMocks(); // Resets mock between tests
  });

describe("Signup Component", () => {
    beforeEach(() => {
    render(<Signup />);
    });


    // ensuring the form renders correctly
    it("render form correctly", () => {
        expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Confirm your password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Sign up/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Go to log in/i})).toBeInTheDocument();
    })

    //allows users to type in the text fields
    it("takes user input", () => {
        const email_input = screen.getByPlaceholderText("Enter your email");
        const name_input = screen.getByPlaceholderText("Enter your name");
        const password_input = screen.getByPlaceholderText("Enter your password");
        const confirm_password_input = screen.getByPlaceholderText("Confirm your password");


        fireEvent.change(email_input, { target: { value: "test@example.com" } });
        fireEvent.change(name_input, { target: { value: "TestUser" } });
        fireEvent.change(password_input, { target: { value: "password123" } });
        fireEvent.change(confirm_password_input, { target: { value: "password123" } });

        expect(email_input).toHaveValue("test@example.com");
        expect(name_input).toHaveValue("TestUser");
        expect(password_input).toHaveValue("password123");
        expect(confirm_password_input).toHaveValue("password123");
    });

    //test error messages on empty form
    it("empty form on submit", async () => {
        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText("Email is required")).toBeInTheDocument();
            expect(screen.getByText("Password is required")).toBeInTheDocument();
            expect(screen.getByText("Name is required")).toBeInTheDocument();
            expect(screen.getByText("Confirm Password is required")).toBeInTheDocument();
        });
    });

    //test error messages when passwords don't match
    it("passwords don't match on submit", async () => {

        fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
            target: { value: "test@example.com" },
          });


        fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
            target: {value: "test" },
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
            target: {value: "password123"},
        });

        fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
            target: {value: "password456"},
        });

        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.queryByText(/passwords do not match/i)).toBeInTheDocument();
        });

    });

    // ensuring fetch is called when submit is clicked
    it("fetch on submit", async () => {
        fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
            target: { value: "test@example.com" },
          });


        fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
            target: {value: "test" },
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"),  {
            target: {value: "password123"},
        });

        fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
            target: {value: "password123"}
        });

        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/register", expect.any(Object));
          });
    });

    // TODO: Case sensitivity in emails

    // TODO: edge cases - like a password that is only made of spaces

    // TODO: duplicate email case - when integrated with backend

});