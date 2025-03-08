import { MemoryRouter } from 'react-router-dom';
import MockAuthContextProvider from '../__mocks__/MockAuthContextProvider';
import Home from '../pages/Home';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import {describe, beforeEach, afterEach, expect, it, vi} from "vitest";
import axiosPrivate from '../../api/axios';
import useAxiosPrivate from '../../auth/hooks/useAxiosPrivate'


vi.mock('../../auth/hooks/useAxiosPrivate', () => ({
    default: vi.fn(),
  }));

let mockAxios;

let goalsData = [
    { _id: "1", name: "Learn guitar", description: "Play chords", completed: false }
];

beforeEach(() => {

    HTMLDialogElement.prototype.show = vi.fn();
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    mockAxios = {
        get: vi.fn().mockImplementation(() => {
            return Promise.resolve({ data: { data: goalsData } });
        }),
        post: vi.fn().mockImplementation((url, data) => {

            // dynamically addign the new goal
            const newGoal = { _id: String(goalsData.length + 1), ...data };
            goalsData.push(newGoal);


            return Promise.resolve({ data: { success: true } });
        }),
        delete: vi.fn().mockImplementation((url) => {
            const goalId = url.split("/").pop(); // Extract goal ID

            const currGoal = goalsData.find(g => g._id === goalId);
            
            // Remove goal from mock data
            goalsData = goalsData.filter(g => g._id !== goalId);


            return Promise.resolve({ data: { data: currGoal } });
        }),
        put: vi.fn().mockImplementation((url, data) => {
            const goalId = url.split("/").pop(); // Extract goal ID

            let goalIndex = goalsData.findIndex((g) => g._id === goalId); // Extract goal index

            if (goalIndex === -1) {
                return Promise.reject(new Error("Goal not found"));
            }

            goalsData[goalIndex] = { ...goalsData[goalIndex], ...data };

            return Promise.resolve({ data: { data: goalsData[goalIndex] } }); 

        }),
    };

    useAxiosPrivate.mockReturnValue(mockAxios);
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
            expect(mockAxios.post).toHaveBeenCalledTimes(1);
            expect(mockAxios.post).toHaveBeenCalledWith("/goals", expect.objectContaining({
              name: "Run a half marathon",
              description: "Run 2x a day"
            }));
            expect(screen.getByText((content) => content.includes("Run a half marathon"))).toBeInTheDocument();
        });
    });

    it("should open an existing goal modal on the homepage, populated correctly", async () => {
        //using default mocked goal from above, 'Learn guitar'
        const currGoal = screen.getByText("Learn guitar").closest("li"); 

        await waitFor(() => expect(currGoal).toBeInTheDocument());

        fireEvent.click(screen.getByText((content) => content.includes("Learn guitar")));

        expect(screen.getByText(/edit goal/i)).toBeInTheDocument();
        expect(screen.getByText(/learn guitar/i)).toBeInTheDocument();
        expect(screen.getByText(/play chords/i)).toBeInTheDocument();
    });

    it("should delete an existing goal modal on the homepage", async() => {


        const currGoal = screen.getByText("Run a half marathon").closest("li"); 
        expect(currGoal).toBeInTheDocument(); 

        fireEvent.click(within(currGoal).getByText("Delete"));


        await waitFor(() => {
            expect(mockAxios.delete).toHaveBeenCalledTimes(1);
            expect(screen.queryByText("Run a half marathon")).not.toBeInTheDocument();
        });
        
    // });

     //TODO: ADD API MOCKING
    it("should update an existing goal modal on the homepage", async () => {
        const addGoal = screen.getByText(/\+ add goal/i);
        fireEvent.click(addGoal);

    //     const nameInput = screen.getByTestId("form-input-name-element");
    //     const descInput = screen.getByTestId("form-input-description-element");
    //     const submitButton = screen.getByTestId("form-submit-button");

    //     fireEvent.change(nameInput, { target: { value: "Run a Half marathon" } });
    //     fireEvent.change(descInput, { target: { value: "Run 2x a day" } });

    //     fireEvent.click(submitButton);

    //     expect(screen.getByText("Run a Half marathon")).toBeInTheDocument();

        const currGoal = screen.getByText("Run a Half marathon").closest("li"); 

        await waitFor(() => expect(currGoal).toBeInTheDocument());

        fireEvent.click(within(currGoal).getByText("Run a Half marathon"));


        fireEvent.change(screen.getByTestId("form-input-name-element"), { target: { value: "Run a marathon" } });
        fireEvent.change(screen.getByTestId("form-input-description-element"), { target: { value: "Run 5 miles/day"} });

    //     fireEvent.click(submitButton);


        await waitFor(() => {
            expect(mockAxios.put).toHaveBeenCalledTimes(1);
            expect(screen.getByText((content) => content.includes("Run a marathon"))).toBeInTheDocument();
        });
        
    // });
    


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
