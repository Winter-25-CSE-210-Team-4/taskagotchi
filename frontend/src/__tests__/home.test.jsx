import { MemoryRouter } from 'react-router-dom';
import MockAuthContextProvider from '../__mocks__/MockAuthContextProvider';
import Home from '../pages/Home';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import {describe, beforeEach, afterEach, expect, it, vi} from "vitest";
import axiosPrivate from '../../api/axios';
import useAxiosPrivate from '../../auth/hooks/useAxiosPrivate'
import GoalForm from '../components/GoalForm/GoalForm';


vi.mock('../../auth/hooks/useAxiosPrivate', () => ({
    default: vi.fn(),
  }));

let mockAxios;
beforeEach(() => {

    let goalsData = [
        { _id: "1", name: "Learn guitar", description: "Play chords", completed: false }
    ];

    let tasksData = [
        {_id: '1a',
            name: 'Learn A-minor chord',
            description: 'watch videos',
            isCompleted: false,
            deadline: new Date(),
            goal_id: {_id:"1"},}
    ];


    HTMLDialogElement.prototype.show = vi.fn();
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    mockAxios = {
        get: vi.fn().mockImplementation((url) => {
            if (url === "/goals") {
                return Promise.resolve({ data: { data: goalsData } });
            }
            if(url === "/tasks") {
                console.log("Returning tasksData:", tasksData); // 🔥 Debugging
                return Promise.resolve({ data: { tasks: [...tasksData] } }); 
            }
        }),
        post: vi.fn().mockImplementation((url, data) => {

            if (url === "/goals") {
                // dynamically addign the new goal
                const newGoal = { _id: String(goalsData.length + 1), ...data };
                goalsData.push(newGoal);

                return Promise.resolve({ data: { success: true } });
            } 
            if (url === "/tasks") {
                console.log("[MOCK] adding task with data ", data)
                const newTask = { _id: String(tasksData.length + 1), ...data };
                tasksData.push(newTask);
                return Promise.resolve({ data: { success: true } });
            }

        }),
        delete: vi.fn().mockImplementation((url) => {
            const id = url.split("/").pop();

            if (url === "/goals") {

                const currGoal = goalsData.find(g => g._id === id);
                
                // Remove goal from mock data
                goalsData = goalsData.filter(g => g._id !== id);


                return Promise.resolve({ data: { data: currGoal } });
            } else {
                const currTask = tasksData.find((t) => t._id === id); 

                // Remove task from mock data 
                tasksData = tasksData.filter((t) => t._id !== id);

                return Promise.resolve({ data: { data: currTask } });
            }
        }),
        put: vi.fn().mockImplementation((url, data) => {
            const id = url.split("/").pop();


            let goalIndex = goalsData.findIndex((g) => g._id === id); // Extract goal index


            goalsData[goalIndex] = { ...goalsData[goalIndex], ...data };

            return Promise.resolve({ data: { data: goalsData[goalIndex] } }); 
        }),
        patch: vi.fn().mockImplementation((url, data) => {
            console.log("Mocking PATCH /tasks/:id with:", data);

            const id = url.split("/").pop();

            let taskIndex = tasksData.findIndex((g) => g._id === id);

            tasksData[taskIndex] = {...tasksData[taskIndex], ...data};


            return Promise.resolve({ data: { tasks: tasksData[taskIndex] } }); 
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

        const goalForm = document.getElementById('goal-form-modal');

        const closeButton = within(goalForm).getByTestId('form-cancel-button');
        fireEvent.click(closeButton);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    });

    it("should close goal modal with back button", () => {
        
        const addGoal = screen.getByText(/\+ Add Goal/i);
        fireEvent.click(addGoal);
        expect(screen.getByText(/create a goal/i)).toBeInTheDocument();

        const goalForm = document.getElementById('goal-form-modal');

        const backButton = within(goalForm).getByAltText("back-icon")
        fireEvent.click(backButton);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    });


    it("should add a new goal to list on homepage", async () => {
        const addGoal = screen.getByText(/\+ add goal/i);
        fireEvent.click(addGoal);

        const goalForm = document.getElementById('goal-form-modal');

        const nameInput = within(goalForm).getByTestId("form-input-name-element");
        const descInput = within(goalForm).getByTestId("form-input-description-element");
        const submitButton = within(goalForm).getByTestId("form-submit-button");

        fireEvent.change(nameInput, { target: { value: "Run a half marathon" } });
        fireEvent.change(descInput, { target: { value: "Run 2x a day" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledTimes(1);
            expect(mockAxios.post).toHaveBeenCalledWith("/goals", expect.objectContaining({
              name: "Run a half marathon",
              description: "Run 2x a day"
            }));
            expect(screen.getAllByText((content) => content.includes("Run a half marathon")).length).toBe(3);
        });
    });

    it("should open an existing goal modal on the homepage, populated correctly", async () => {
        //using default mocked goal from above, 'Learn guitar'
        
        const goalElements = screen.getAllByText((content) => content.includes("Learn guitar"));

        const clickableElement = goalElements.find((element) => element.tagName.toLowerCase() === "span");

        const headingElement = goalElements.find((element) => element.tagName.toLowerCase() == "h3")

        expect(clickableElement).toBeInTheDocument();

        fireEvent.click(clickableElement);
        
        await waitFor(() => {
            fireEvent.click(clickableElement);

            expect(headingElement).toBeInTheDocument();
            expect(screen.getByText(/play chords/i)).toBeInTheDocument();
        })
    });

    it("should delete an existing goal modal on the homepage", async() => {
        // using default mocked goal from above, 'Learn guitar'

        const goalElements = screen.getAllByText((content) => content.includes("Learn guitar"));
        const clickableElement = goalElements.find((element) => element.tagName.toLowerCase() === "span");

        expect(clickableElement).toBeInTheDocument();

        const currGoal = clickableElement.closest("li");

    
        fireEvent.click(within(currGoal).getByText("Delete"));


        await waitFor(() => {
            expect(mockAxios.delete).toHaveBeenCalledTimes(1);
            expect(screen.queryByText("Run a half marathon")).not.toBeInTheDocument();
        });
        
    });


    it("should open goal form modal when edit clicked", async () => {
        
        const goalSection = screen.getByText("Goals").closest("div"); 

        const goalElement = within(goalSection).getByText("Learn guitar", { selector: "span" });

        expect(goalElement).toBeInTheDocument();

        fireEvent.click(goalElement);

        const goalModal = await waitFor(() => within(document.body).getByText("Learn guitar", { selector: "h3" }));

        expect(goalModal).toBeInTheDocument();

        const editButton = within(goalModal.closest("div.modal")).getByText("Edit");
        fireEvent.click(editButton);

        expect(screen.getByText(/edit goal/i)).toBeInTheDocument(); 
    });

    it("should successfully edit an existing goal", async () => {
        const goalSection = screen.getByText("Goals").closest("div"); 

        const goalElement = within(goalSection).getByText("Learn guitar", { selector: "span" });

        expect(goalElement).toBeInTheDocument();

        fireEvent.click(goalElement);

        const goalModal = await waitFor(() => within(document.body).getByText("Learn guitar", { selector: "h3" }));

        expect(goalModal).toBeInTheDocument();

        const editButton = within(goalModal.closest("div.modal")).getByText("Edit");
        fireEvent.click(editButton);

        const goalForm = document.getElementById('goal-form-modal');

        const nameInput = within(goalForm).getByTestId("form-input-name-element");
        const submitButton = within(goalForm).getByTestId("form-submit-button");


        fireEvent.change(nameInput, { target: { value: "Learn piano" } });

    //     fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockAxios.put).toHaveBeenCalledTimes(1);
            expect(mockAxios.put).toHaveBeenCalledWith("/goals/1", expect.objectContaining({
                deadline: NaN,
                description: "Play chords",
                name : "Learn piano",
              }));
              expect(screen.getAllByText((content) => content.includes("Learn piano")).length).toBe(4);

        });

    });
    
// /////////////////////////////////////// TASK TESTS ////////////////////////////////////
    it("should open task modal upon add task click", () => {

        const addTask = screen.getByText(/\+ Add Task/i);

        fireEvent.click(addTask);

        expect(screen.getByText(/create a task/i)).toBeInTheDocument();

    });

    it("should close task modal with close button", () => {
        
        const addTask = screen.getByText(/\+ Add Task/i);
        fireEvent.click(addTask);
        expect(screen.getByText(/create a task/i)).toBeInTheDocument();

        const taskForm = document.getElementById('task-form-modal');

        const closeButton = within(taskForm).getByTestId('form-cancel-button');
        fireEvent.click(closeButton);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    });

    it("should close task modal with back button", () => {
        
        const addTask = screen.getByText(/\+ Add Task/i);
        fireEvent.click(addTask);
        expect(screen.getByText(/create a task/i)).toBeInTheDocument();

        const taskForm = document.getElementById('task-form-modal');

        const backButton = within(taskForm).getByAltText("back-icon")
        fireEvent.click(backButton);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    });

    it("should add a new task to the homepage", async () => {
        const addTask = screen.getByText(/\+ add task/i);
        fireEvent.click(addTask);

        const taskForm = document.getElementById('task-form-modal');

        const nameInput = within(taskForm).getByTestId("form-input-name-element");
        const descInput = within(taskForm).getByTestId("form-input-description-element");
        const submitButton = within(taskForm).getByTestId("form-submit-button");
        const goalSelect = within(taskForm).getByTestId("form-input-select-element")

        fireEvent.change(nameInput, { target: { value: "Learn D major chord" } });
        fireEvent.change(descInput, { target: { value: "Practice 2x a day" } });
        fireEvent.change(goalSelect, { target: { value: "1" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledTimes(1);
            expect(mockAxios.post).toHaveBeenCalledWith("/tasks", expect.objectContaining({
              name: "Learn D major chord",
              description: "Practice 2x a day",
              goal_id: "1"
            }));

            expect(screen.getAllByText((content) => content.includes("Learn D major chord")).length).toBe(2);

        });

    });

    it("should open an existing task modal on the homepage, populated correctly", async () => {
        //using default mocked task from above, 'Learn A-minor chord'
        
        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalled()
        })
        
        const taskElements = screen.getAllByText((content) => content.includes("Learn A-minor chord"));

        const clickableElement = taskElements.find((element) => element.tagName.toLowerCase() === "span");

        const headingElement = taskElements.find((element) => element.tagName.toLowerCase() == "h3")

        expect(clickableElement).toBeInTheDocument();

        fireEvent.click(clickableElement);
        
        await waitFor(() => {
            fireEvent.click(clickableElement);

            expect(headingElement).toBeInTheDocument();
            expect(screen.getByText(/watch videos/i)).toBeInTheDocument();
        })
    });

    it("should open task form modal when edit clicked", async () => {
        
        const taskSection = screen.getByText("Tasks").closest("div"); 

        const taskElement = within(taskSection).getByText("Learn A-minor chord", { selector: "span" });

        expect(taskElement).toBeInTheDocument();

        fireEvent.click(taskElement);

        const taskModal = await waitFor(() => within(document.body).getByText("Learn A-minor chord", { selector: "h3" }));

        expect(taskModal).toBeInTheDocument();

        const editButton = within(taskModal.closest("div.modal")).getByText("Edit");
        fireEvent.click(editButton);

        expect(screen.getByText(/edit task/i)).toBeInTheDocument(); 
    });
    
    it("should successfully edit an existing task", async () => {
        const taskSection = screen.getByText("Tasks").closest("div"); 

        const taskElement = within(taskSection).getByText("Learn A-minor chord", { selector: "span" });

        expect(taskElement).toBeInTheDocument();

        fireEvent.click(taskElement);

        const taskModal = await waitFor(() => within(document.body).getByText("Learn A-minor chord", { selector: "h3" }));

        expect(taskModal).toBeInTheDocument();

        const editButton = within(taskModal.closest("div.modal")).getByText("Edit");
        fireEvent.click(editButton);

        const taskForm = document.getElementById('task-form-modal');

        const nameInput = within(taskForm).getByTestId("form-input-name-element");
        const submitButton = within(taskForm).getByTestId("form-submit-button");


        fireEvent.change(nameInput, { target: { value: "Learn C# Major Chord" } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalledTimes(1);
            expect(mockAxios.patch).toHaveBeenCalledWith("/tasks/1a", expect.objectContaining({
                name : "Learn C# Major Chord",
            }));

            expect(screen.getAllByText((content) => content.includes("Learn C# Major Chord")).length).toBe(2);

        });

    });


});
