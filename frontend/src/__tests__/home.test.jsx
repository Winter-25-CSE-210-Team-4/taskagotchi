import { MemoryRouter } from 'react-router-dom';
import MockAuthContextProvider from '../__mocks__/MockAuthContextProvider';
import Home from '../pages/Home';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {describe, beforeEach, afterEach, expect, it, vi} from "vitest";
import axios from "../../api/axios";



beforeEach(() => {
    HTMLDialogElement.prototype.show = vi.fn();
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    vi.spyOn(axios, "get").mockResolvedValue({
        data: { 
          data: [{ id: "1", name: "Learn guitar", description: "Play chords", completed: false }]
        }
      });
    
      vi.spyOn(axios, "post").mockResolvedValue({ data: { success: true } });
      vi.spyOn(axios, "put").mockResolvedValue({ data: { success: true } });
      vi.spyOn(axios, "delete").mockResolvedValue({ data: { success: true } });
});

afterEach(() => {
    vi.restoreAllMocks();
})

describe("Homepage Compoenet", () => {
    beforeEach( ()=> {
        render(
            <MemoryRouter>
              <MockAuthContextProvider>
                <Home />
              </MockAuthContextProvider>
            </MemoryRouter>
        );
    });


    it("should render page elements correctly", () => {
        
        expect(screen.getByText(/Goals/i)).toBeInTheDocument();

        expect(screen.getByText(/Tasks/i)).toBeInTheDocument();

        expect(screen.getByText(/\+ Add Task/i)).toBeInTheDocument();

        expect(screen.getByText(/\+ Add Goal/i)).toBeInTheDocument();

        expect(screen.getByAltText(/TaskaGoTchi Character/i)).toBeInTheDocument();

        expect(screen.getByText(/Experince: 0\/100/i)).toBeInTheDocument();
    });

/////////////////////////////////////// GOAL TESTS ////////////////////////////////////
    it("should open goal modal upon add goal click", () => {

        const addGoal = screen.getByText(/\+ Add Goal/i);

        fireEvent.click(addGoal);

        expect(screen.getByText(/create a goal/i)).toBeInTheDocument();

    });

    it("should close goal modal with close button", () => {
        
        const addGoal = screen.getByText(/\+ Add Goal/i);
        fireEvent.click(addGoal);
        expect(screen.getByText(/create a goal/i)).toBeInTheDocument();

        const closeButton = screen.getByTestId("form-cancel-button");
        fireEvent.click(closeButton);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    });

    it("should close goal modal with back button", () => {
        
        const addGoal = screen.getByText(/\+ Add Goal/i);
        fireEvent.click(addGoal);
        expect(screen.getByText(/create a goal/i)).toBeInTheDocument();

        const backButton = screen.getByAltText("back-icon").closest("button"); 
        fireEvent.click(backButton);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    });


    //TODO: ADD API MOCKING
    it("should add a new goal to list on homepage", async () => {
        const addGoal = screen.getByText(/\+ add goal/i);
        fireEvent.click(addGoal);

        const nameInput = screen.getByTestId("form-input-name-element");
        const descInput = screen.getByTestId("form-input-description-element");
        const submitButton = screen.getByTestId("form-submit-button");

        fireEvent.change(nameInput, { target: { value: "Run a half marathon" } });
        fireEvent.change(descInput, { target: { value: "Run 2x a day" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith("/goals", expect.objectContaining({
              name: "Run a half marathon",
              description: "Run 2x a day"
            }));
          });

        await waitFor(() => expect(screen.getByText("Run a half marathon")).toBeInTheDocument());
    });

     //TODO: ADD API MOCKING
    it("should open an existing goal modal on the homepage", () => {
        const addGoal = screen.getByText(/\+ add goal/i);
        fireEvent.click(addGoal);

        const nameInput = screen.getByTestId("form-input-name-element");
        const descInput = screen.getByTestId("form-input-description-element");
        const submitButton = screen.getByTestId("form-submit-button");

        fireEvent.change(nameInput, { target: { value: "Run a Half marathon" } });
        fireEvent.change(descInput, { target: { value: "Run 2x a day" } });

        fireEvent.click(submitButton);

        expect(screen.getByText("Run a Half marathon")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Run a Half marathon"));

        expect(screen.getByText(/edit goal/i)).toBeInTheDocument();
    });

     //TODO: ADD API MOCKING
    it("should delete an existing goal modal on the homepage", () => {
        const addGoal = screen.getByText(/\+ add goal/i);
        fireEvent.click(addGoal);

        const nameInput = screen.getByTestId("form-input-name-element");
        const descInput = screen.getByTestId("form-input-description-element");
        const submitButton = screen.getByTestId("form-submit-button");

        fireEvent.change(nameInput, { target: { value: "Run a Half marathon" } });
        fireEvent.change(descInput, { target: { value: "Run 2x a day" } });

        fireEvent.click(submitButton);

        expect(screen.getByText("Run a Half marathon")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Delete"));

        expect(screen.queryByText("Run a half marathon")).not.toBeInTheDocument();
        
    });

     //TODO: ADD API MOCKING
    it("should update an existing goal modal on the homepage", () => {
        const addGoal = screen.getByText(/\+ add goal/i);
        fireEvent.click(addGoal);

        const nameInput = screen.getByTestId("form-input-name-element");
        const descInput = screen.getByTestId("form-input-description-element");
        const submitButton = screen.getByTestId("form-submit-button");

        fireEvent.change(nameInput, { target: { value: "Run a Half marathon" } });
        fireEvent.change(descInput, { target: { value: "Run 2x a day" } });

        fireEvent.click(submitButton);

        expect(screen.getByText("Run a Half marathon")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Run a Half marathon"));

        fireEvent.change(screen.getByTestId("form-input-name-element"), { target: { value: "Run a marathon" } });
        fireEvent.change(screen.getByTestId("form-input-description-element"), { target: { value: "Run more" } });

        fireEvent.click(submitButton);


        expect(screen.getByText("Run a marathon")).toBeInTheDocument();
        expect(screen.queryByText("Run a half marathon")).not.toBeInTheDocument();
        
    });
    


/////////////////////////////////////// TASK TESTS ////////////////////////////////////
    it("should open task modal upon add task click", () => {

        const addTask = screen.getByText(/\+ Add Task/i);

        fireEvent.click(addTask);

        expect(screen.getByText(/add new task/i)).toBeInTheDocument();

    });

    it("should close task modal with close button", () => {
        
        const addTask = screen.getByText(/\+ Add Task/i);
        fireEvent.click(addTask);
        expect(screen.getByText(/add new Task/i)).toBeInTheDocument();

        const closeButton = screen.getByTestId("form-cancel-button");
        fireEvent.click(closeButton);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    });


});
