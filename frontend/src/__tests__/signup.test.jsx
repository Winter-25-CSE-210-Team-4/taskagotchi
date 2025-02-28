import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../pages/Signup.jsx";
import { describe, it, vi, expect, beforeEach} from "vitest";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";


vi.mock("axios"); 

beforeEach(() => {
  axios.post.mockReset();
});


describe("Signup Component", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
              <Signup />
            </MemoryRouter>
          );
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

        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));
        

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

        axios.post.mockResolvedValueOnce({
            data: {
              token: "mock-token",
              user: { id: 1, email: "test@example.com", name: "test" },
            },
          });

          await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith(
              "http://localhost:5050/api/auth/register",
              expect.objectContaining({
                email: "test@example.com",
                password: "password123",
                name: "test",
              })
            );
          });
    });

    //test email input as lower case
    it("submits email as lowercase regardless of input", async () => {
        const email_input = screen.getByPlaceholderText("Enter your email");
        const name_input = screen.getByPlaceholderText("Enter your name");
        const password_input = screen.getByPlaceholderText("Enter your password");
        const confirm_password_input = screen.getByPlaceholderText("Confirm your password");


        fireEvent.change(email_input, { target: { value: "Test@example.COM" } });
        fireEvent.change(name_input, { target: { value: "TestUser" } });
        fireEvent.change(password_input, { target: { value: "password123" } });
        fireEvent.change(confirm_password_input, { target: { value: "password123" } });

        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));

        axios.post.mockResolvedValueOnce({
            data: {
                token: "mock-token",
                user: { id: 1, email: "test@example.com", name: "TestUser" },
            },
        });

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                "http://localhost:5050/api/auth/register",
                expect.objectContaining({
                    email: "test@example.com", // ✅ Email should be lowercase
                    name: "TestUser",
                    password: "password123",
                })
            );
        });

    });

    // mockig backend call to test both duplicate and lower+uppercase emails
    it("lowercase and uppercase emails treated the same and handling duplicates", async () => {

        //mock backend call
        axios.post.mockResolvedValueOnce({
            data: { message: "User registered successfully" },
        });
    
        axios.post.mockRejectedValueOnce({
            response: { data: { message: "Email already in use" } },
        });
        
        //first sumbission
        const email_input = screen.getByPlaceholderText("Enter your email");
        const name_input = screen.getByPlaceholderText("Enter your name");
        const password_input = screen.getByPlaceholderText("Enter your password");
        const confirm_password_input = screen.getByPlaceholderText("Confirm your password");


        fireEvent.change(email_input, { target: { value: "test@example.com" } });
        fireEvent.change(name_input, { target: { value: "TestUser" } });
        fireEvent.change(password_input, { target: { value: "password123" } });
        fireEvent.change(confirm_password_input, { target: { value: "password123" } });

        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith(
                "http://localhost:5050/api/auth/register",
                expect.objectContaining({
                    email: "test@example.com",
                    name: "TestUser",
                    password: "password123",
                })
            );
        });


        // Clear form 
        fireEvent.change(email_input, { target: { value: "" } });
        fireEvent.change(name_input, { target: { value: "" } });
        fireEvent.change(password_input, { target: { value: "" } });
        fireEvent.change(confirm_password_input, { target: { value: "" } });
        

        //second submission
        fireEvent.change(email_input, { target: { value: "TEST@example.com" } });
        fireEvent.change(name_input, { target: { value: "user" } });
        fireEvent.change(password_input, { target: { value: "123password" } });
        fireEvent.change(confirm_password_input, { target: { value: "123password" } });
  
          fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));

          await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(2); // Ensuring both calls were made
            expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
        });
        

    });

    // test a password that is only made of spaces - should not be allowed
    it("appropriate length password of only spaces submitted", async () => {
        const password_input = screen.getByPlaceholderText("Enter your password");
        fireEvent.change(password_input, { target: { value: "                " } });

        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.queryByText(/password cannot contain spaces/i)).toBeInTheDocument();
        });
    });

    // test a password of length more than 25 - should not be allowed
    it("password of length more than 25 submitted", async () => {
        const password_input = screen.getByPlaceholderText("Enter your password");
        fireEvent.change(password_input, { target: { value: "abcdefghijklmnopqrstuvwxyz" } });

        fireEvent.submit(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.queryByText(/password cannot be more than 20 characters/i)).toBeInTheDocument();
        });
    });

    // TODO: duplicate email case - when integrated with backend

});

