import { MemoryRouter } from 'react-router-dom';
import MockAuthContextProvider from '../__mocks__/MockAuthContextProvider';
import Home from '../pages/Home';
import { render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import {describe, beforeEach, afterEach, expect, it, vi} from "vitest";
import useAxiosPrivate from '../../auth/hooks/useAxiosPrivate'

vi.mock('../../auth/hooks/useAxiosPrivate', () => ({
    default: vi.fn(),
  }));

vi.mock('react-confetti', () => {
    return {
        __esModule: true,
        default: () => null, 
    };
});

let petData = [];

let mockAxios;
beforeEach(() => {
    let goalsData = [
        { 
            _id: "1", 
            name: "Learn guitar", 
            description: "Play chords", 
            isCompleted: false,
            deadline: new Date() }
    ];

    let tasksData = [
        {   
            _id: '1a',
            name: 'Learn A-minor chord',
            description: 'watch videos',
            isCompleted: false,
            deadline: new Date(),
            goal_id: {_id:"1"},}
    ];

    petData = [
        {
            _id: "pet1",
            name: "TaskaPet",
            health: 100,
            level: 1,
            exp: 30
        }
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
                return Promise.resolve({ data: { tasks: [...tasksData] } }); 
            }
            if (url === "/pets") {
                return Promise.resolve({ data: { success: true, data: petData } });
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

            if (url.includes("/goals/")) {

                const currGoal = goalsData.find(g => g._id === id);
                
                // Remove goal from mock data
                goalsData = goalsData.filter(g => g._id !== id);


                return Promise.resolve({ data: { data: currGoal } });
            }  
            if (url.includes("/tasks/")) {

                const deletedTask = tasksData.find((t) => t._id === id); 

                // Remove task from mock data 
                tasksData = tasksData.filter((t) => t._id !== id);


                return Promise.resolve({ data: { deletedTask } });
            }
        }),
        put: vi.fn().mockImplementation((url, data) => {

            if (url === "/pets/gain-exp") {
                console.log("Mocking XP gain", data);
                petData[0].exp += data.exp; // Update XP
                return Promise.resolve({ data: { success: true, data: petData[0] } });
            }

            const id = url.split("/").pop();


            let goalIndex = goalsData.findIndex((g) => g._id === id); // Extract goal index


            goalsData[goalIndex] = { ...goalsData[goalIndex], ...data };

            return Promise.resolve({ data: { data: goalsData[goalIndex] } }); 
        }),
        patch: vi.fn().mockImplementation((url, data) => {
            console.log("PATCH calls:", mockAxios.patch.mock.calls);

            
            if (url === '/tasks/1a') {
                const id = url.split("/").pop();
                console.log("in edit case");
                const taskIndex = tasksData.findIndex((t) => t._id === id);

                tasksData[taskIndex] = { ...tasksData[taskIndex], ...data };

                return Promise.resolve({ data: { task: tasksData[taskIndex] } });
            } else if (url === "/tasks/1a/complete") {

                const taskIndex = tasksData.findIndex((t) => t._id === "1a");
                
                tasksData[taskIndex].isCompleted = true;

                return Promise.resolve({ data: { _id: "1a", isCompleted: true } });  

            }
            
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

        expect(screen.getByText(/Experience: 0\/100/i)).toBeInTheDocument();

        expect(screen.getByTestId("home-user-icon")).toBeInTheDocument();
    });

/////////// USER ICON TESTS ////////////////////////////////////
it("should display users first initial in user icon", () => {
    const icon = screen.getByTestId("home-user-icon");

    const initial = within(icon).getByText("J");

    expect(initial).toBeInTheDocument();
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

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockAxios.put).toHaveBeenCalledTimes(1);
            expect(mockAxios.put).toHaveBeenCalledWith("/goals/1", expect.objectContaining({
                deadline: expect.any(Number),
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

    it("should delete a task", async () => {
        const taskElement = screen.getAllByText((content) => content.includes("Learn A-minor chord"));
        const clickableElement = taskElement.find((element) => element.tagName.toLowerCase() === "span");

        expect(clickableElement).toBeInTheDocument();

        const currTask = clickableElement.closest("li");

    
        fireEvent.click(within(currTask).getByText("Delete"));

        // Ensure the DELETE request was made
        await waitFor(() => {
            expect(mockAxios.delete).toHaveBeenCalledTimes(1);
            expect(mockAxios.delete).toHaveBeenCalledWith("/tasks/1a");
        });

        // Ensure the task is removed from UI
        await waitFor(() => {
            expect(screen.queryByText(/Learn A-minor chord/i)).not.toBeInTheDocument();
        });
    });

//////////////////// TASK COMPLETION & PET TESTS ///////////////////////////////////////////////////
    it("should mark an existing task as complete update xp and update pet picture", async () => {

        const taskElements = screen.getAllByText(/Learn A-minor chord/i);
    
        // Find the one inside the task list (should be inside a <span>)
        const taskSpan = taskElements.find((el) => el.tagName.toLowerCase() === "span");
        expect(taskSpan).toBeInTheDocument(); 

        // Find the closest <li> that contains this task
        const taskItem = taskSpan.closest("li");
        expect(taskItem).toBeInTheDocument();

        // Get the checkbox inside task <li>
        const taskCheckboxes = within(taskItem).getAllByRole("checkbox");
        const taskCheckbox = taskCheckboxes.find((checkbox) => checkbox.classList.contains("checkbox-sm"));

        expect(taskCheckbox).toBeInTheDocument();
        expect(taskCheckbox.checked).toBe(false);



        fireEvent.click(taskCheckbox);

        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalledTimes(1);
            expect(mockAxios.patch).toHaveBeenCalledWith("/tasks/1a/complete");
        });
    
        // Ensure the UI updates
        await waitFor(() => {
            expect(mockAxios.put).toHaveBeenCalledWith("/pets/gain-exp", { exp: 5 });
        });
    
        // Verify XP update and pet update
        await waitFor(() => {
            expect(screen.getByText(/Experience: 35\/100/i)).toBeInTheDocument();
            const petImage = screen.getByRole("img", { name: "TaskaGoTchi Character" });
            expect(petImage).toHaveAttribute("src", "/images/pet-2.png");
        });
    
    });

    it("should update pet picture to image 3 when task completed", async () => {

        petData[0].exp = 62;
        console.log(petData[0].exp);

        const taskElements = screen.getAllByText(/Learn A-minor chord/i);
    
        // Find the one inside the task list (should be inside a <span>)
        const taskSpan = taskElements.find((el) => el.tagName.toLowerCase() === "span");
        expect(taskSpan).toBeInTheDocument(); 

        // Find the closest <li> that contains this task
        const taskItem = taskSpan.closest("li");
        expect(taskItem).toBeInTheDocument();

        // Get the checkbox inside task <li>
        const taskCheckboxes = within(taskItem).getAllByRole("checkbox");
        const taskCheckbox = taskCheckboxes.find((checkbox) => checkbox.classList.contains("checkbox-sm"));

        expect(taskCheckbox).toBeInTheDocument();
        expect(taskCheckbox.checked).toBe(false);



        fireEvent.click(taskCheckbox);

        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalledTimes(1);
            expect(mockAxios.patch).toHaveBeenCalledWith("/tasks/1a/complete");
        });
    
        // Ensure the UI updates
        await waitFor(() => {
            expect(mockAxios.put).toHaveBeenCalledWith("/pets/gain-exp", { exp: 5 });
        });

        console.log(petData[0].exp)
    
        // Verify XP update and pet update
        await waitFor(() => {
            expect(screen.getByText(/Experience: 67\/100/i)).toBeInTheDocument();
            const petImage = screen.getByRole("img", { name: "TaskaGoTchi Character" });
            expect(petImage).toHaveAttribute("src", "/images/pet-3.png");
        });
    
    });
});
