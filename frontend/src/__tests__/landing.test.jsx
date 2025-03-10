import Landing from "../pages/Landing";
import { MemoryRouter} from "react-router-dom";
import { render, screen, fireEvent} from "@testing-library/react"
import { describe, it, vi, beforeEach, expect } from "vitest";
import MockAuthContextProvider from '../__mocks__/MockAuthContextProvider';


const mockUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const router = await vi.importActual("react-router-dom");
    return {
        ...router,
        useNavigate: () => mockUseNavigate,
    };
});



describe('Landing Component', () => {
    
    beforeEach(() => {
      render(
        <MemoryRouter>
            <MockAuthContextProvider>
                <Landing />
            </MockAuthContextProvider>
        </MemoryRouter>
      );
    });


    it("page renders correctly", () => {

        expect(screen.getByText("Taskagotchi")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /login/i})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /signup/i})).toBeInTheDocument();
    });

    it("navigates to login when button clicked", () => {

        fireEvent.click(screen.getByRole("button", {name: /login/i}));

        expect(mockUseNavigate).toHaveBeenCalledWith("/login");
    });

    it("navigates to sigup when button clicked", () => {
        fireEvent.click(screen.getByRole("button", {name: /signup/i}));

        expect(mockUseNavigate).toHaveBeenCalledWith("/signup");
    });


});